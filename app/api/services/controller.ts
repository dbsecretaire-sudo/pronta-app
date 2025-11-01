import { ServiceService as Service } from './service';
import { CreateService, Service as ServiceType } from "./types";

const service = new Service(); // Instanciez la classe Service

export const getAllServices = async (): Promise<ServiceType[]> => {
  return await service.getAllServices();
};

export const getServiceById = async (id: number): Promise<ServiceType> => {
  const foundService = await service.getServiceById(id);
  if (!foundService) {
    throw new Error(`Service with ID ${id} not found`);
  }
  return foundService;
};

export const createService = async (serviceData: CreateService): Promise<ServiceType> => {
  return await service.createService(serviceData);
};

export const updateService = async (id: number, serviceData: Partial<ServiceType>): Promise<ServiceType> => {
  return await service.updateService(id, serviceData);
};

export const deleteService = async (id: number): Promise<void> => {
  return await service.deleteService(id);
};