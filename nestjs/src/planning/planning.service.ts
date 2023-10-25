import { ForbiddenException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class PlanningService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getMyPlanList(user_id: number) {
    type Row = {
      plan_id: number;
      plan_title: string;
      image_path: string;
    };

    // let tour_plan_id = await this.
    let planList: Row[] = await this.knex
      .from('plan')
      .innerJoin('image', 'image.id', 'plan.image_id')
      .select(
        'plan.id as plan_id',
        'plan.title as plan_title',
        'image.path as image_path',
      )
      .where({ 'plan.user_id': user_id })
      .orWhere('tour');
    console.log(planList);
    if ((planList = [])) {
      let plan_id = await this.knex.select('plan_id').from('tour_');
    }
    let tourPlanList: Row[] = await this.knex
      .from('plan')
      .innerJoin('image', 'image.id', 'plan.image_id')
      .select(
        'plan.id as plan_id',
        'plan.title as plan_title',
        'image.path as image_path',
      )
      .where({ 'plan.user_id': user_id });
    return { planList };
  }

  async addNewPlan(input: {
    user_id: number;
    title: string;
    image_file: string | undefined;
  }) {
    let image_id: number | null = null;
    if (input.image_file) {
      let [{ id }] = await this.knex('image')
        .insert({
          user_id: input.user_id,
          path: input.image_file,
          is_delete: false,
        })
        .returning('id');
      image_id = id;
    }
    let addPlan = await this.knex('plan')
      .insert({
        title: input.title,
        user_id: input.user_id,
        // country,
        privacy: false,
        image_id,
      })
      .returning('id');

    let plan_id = addPlan[0].id;

    return { plan_id, image_path: input.image_file };
  }

  async addNewTourPlan(input: {
    user_id: number;
    title: string;
    user_list: string;
    image_file: string | undefined;
  }) {
    let image_id: number | null = null;
    let userList = input.user_list.split('');
    if (input.image_file) {
      let [{ id }] = await this.knex('image')
        .insert({
          user_id: input.user_id,
          path: input.image_file,
          is_delete: false,
        })
        .returning('id');
      image_id = id;
    }
    let addPlan = await this.knex('plan')
      .insert({
        title: input.title,
        user_id: input.user_id,
        // country,
        privacy: false,
        image_id,
      })
      .returning('id');

    let plan_id = addPlan[0].id;
    for (let user of userList) {
      await this.knex('tour_plan').insert({
        user_id: user,
        plan_id: plan_id,
      });
    }
    return { plan_id, image_path: input.image_file };
  }

  async getImage(user_id: number) {
    let result = await this.knex
      .select('path')
      .from('image')
      .where('user_id', user_id)
      .first();

    console.log(result);
    if (result === undefined) {
      return { path: null };
    }
    console.log(result);
  }

  async addNewMark(
    user_id: number,
    input: {
      planning_id: number;
      start_date: string;
      end_date: string;
    },
  ) {
    let row = await this.knex
      .select('id')
      .from('plan')
      .where('id', input.planning_id)
      .andWhere('user_id', user_id)
      .first();
    if (row == undefined) {
      throw new ForbiddenException('you are not the planing owner');
    } else {
      await this.knex('plan_detail').insert({
        plan_id: input.planning_id,
        start_date: input.start_date,
        end_date: input.end_date,
      });
      return { result: true };
    }
  }

  async getMarks(plan_id: number) {
    type Row = {
      id: number;
      start_date: string;
      end_date: string;
    };
    console.log({ plan_id });
    let marks: Row = await this.knex
      .from('plan_detail')
      .leftJoin('plan', { 'plan.id': 'plan_detail.plan_id' })
      .select('plan_id as id', 'start_date as startDate', 'end_date as endDate')
      .where({ 'plan.id': plan_id })
      .first();
    console.log({ marks });
    return { marks };
  }

  async addNewEvent(
    user_id: number,
    input: {
      planning_id: number;
      selected_date: string;
      start_time: string;
      end_time: string;
      location: string;
    },
  ) {
    let row = await this.knex
      .select('id')
      .from('plan')
      .where('id', input.planning_id)
      .andWhere('user_id', user_id)
      .first();
    if (row == undefined) {
      throw new ForbiddenException('you are not the planing owner');
    } else {
      await this.knex('daily_event').insert({
        plan_id: input.planning_id,
        selected_date: input.selected_date,
        start_time: input.start_time,
        end_time: input.end_time,
        location: input.location,
        remark: '',
      });
      return { result: true };
    }
  }

  async getEvent(plan_id: number) {
    type Row = {
      id: number;
      selected_date: string;
      start_date: string;
      end_date: string;
      location: string;
      remark: string;
    };
    let events: Row[] = await this.knex
      .from('daily_event')
      .leftJoin('plan', { 'plan.id': 'daily_event.plan_id' })
      .select(
        'plan_id as id',
        'selected_date as selectedDate',
        'start_time as startTime',
        'end_time as endTime',
        'location as location',
        'remark as remark',
      )
      .where('plan.id', plan_id);
    console.log('backend event:', events);

    return events;
  }
}
