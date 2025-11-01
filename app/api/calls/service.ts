import { Call, CallFilter, CallModel } from "./types";

export class CallService {
  private callModel: CallModel;

  constructor() {
    this.callModel = new CallModel({} as Call);
  }

  async getCallsByUserId(filters: CallFilter) {
    return this.callModel.getCallsByUserId(filters);
  }

  async getCallById(id: number) {
    return this.callModel.getCallById(id);
  }

  async createCall(call: Omit<Call, "id">) {
    return this.callModel.createCall(call);
  }

  async updateCall(id: number, call: Partial<Call>) {
    return this.callModel.updateCall(id, call);
  }

  async deleteCall(id: number) {
    return this.callModel.deleteCall(id);
  }
}
