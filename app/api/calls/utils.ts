import { Call, CallType } from "./types";

export const validateCall = (call: Partial<Call>): boolean => {
  return !!call.name && !!call.phone && !!call.date && !!call.type;
};

export const isValidCallType = (type: string): type is CallType => {
  return ["incoming", "outgoing", "missed"].includes(type);
};
