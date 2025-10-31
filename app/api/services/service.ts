import { ServiceModel, Service, CreateService } from "@/Types/Services/index";
import { validateService } from "./utils";

export class ServiceService {
  private serviceModel = new ServiceModel({} as Service);

  async getAllServices(): Promise<Service[]> {
    return this.serviceModel.getAllServices();
  }

  async getServiceById(id: number): Promise<Service | null> {
    return this.serviceModel.getServiceById(id);
  }

  async getServiceByName(name: string): Promise<Service | null> {
    return this.serviceModel.getServiceByName(name);
  }

  async createService(service: CreateService): Promise<Service> {
    if (!validateService(service)) {
      throw new Error("Service name and route are required");
    }
    return this.serviceModel.createService(service);
  }

  async updateService(id: number, service: Partial<Service>): Promise<Service> {
    return this.serviceModel.updateService(id, service);
  }

  async deleteService(id: number): Promise<void> {
    return this.serviceModel.deleteService(id);
  }
}
