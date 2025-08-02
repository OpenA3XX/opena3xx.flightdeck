export interface HardwareBoardDto {
  id: number;
  name: string;
  hardwareBusExtendersCount: number;
  totalInputOutputs: number;
}

export interface HardwareBoardDetailsDto {
  id: number;
  name: string;
  ioExtenderBuses: IOExtenderBusDto[];
}

export interface IOExtenderBusDto {
  id: number;
  name: string;
  ioExtenderBusBits: IOExtenderBitDto[];
}

export interface IOExtenderBitDto {
  id: number;
  name: string;
  hardwareInputSelectorFullName: string;
  hardwareOutputSelectorFullName: string;
}

export interface HardwareInputTypeDto {
  id?: number;
  name: string;
}

export interface HardwareOutputTypeDto {
  id?: number;
  name: string;
}

export interface HardwarePanelOverviewDto {
  id: number;
  name: string;
  aircraftModel: string;
  manufacturer: string;
  cockpitArea: string;
  owner: string;
  detailsUrl?: string;
}

export interface BaseHardwarePanelDto {
  id: number;
  name: string;
  aircraftModel: string;
  manufacturer: string;
  cockpitArea: string;
  owner: string;
}
export interface HardwarePanelDto {
  id: number;
  name: string;
  aircraftModel: string;
  manufacturer: string;
  cockpitArea: string;
  owner: string;
  totalInputs: number;
  totalOutputs: number;
  totalOutputsDiscrete: number;
  totalInputsDiscrete: number;
  hardwareInputs: HardwareInputDto[];
  hardwareOutputs: HardwareOutputDto[];
}

export interface HardwareInputDto {
  id: number;
  name: string;
  hardwareInputType: string;
  hardwarePanelId: number;
  hardwareInputSelectors: HardwareInputSelectorDto[];
}

export interface AddHardwareInputDto {
  name: string;
  hardwareInputType: string;
  hardwarePanelId: number;
  hardwareInputSelectors?: HardwareInputSelectorDto[];
}
export interface HardwareInputSelectorDto {
  id: number;
  name: string;
  hardwareInputType?: string;
  isHardwareInputSelectorMappedWithHardware?: boolean;
}

export interface HardwareOutputDto {
  id: number;
  name: string;
  hardwareOutputType: string;
  outputSelectors: HardwareOutputSelectorDto[];
}

export interface HardwareOutputSelectorDto {
  id: number;
  name: string;
}

export interface SimulatorEventDto {
  id: number;
  friendlyName: string;
  eventName: string;
  simulatorEventType: number;
  simulatorEventTypeName: string;
  simulatorSoftware: number;
  simulatorSoftwareName: string;
  simulatorEventSdkType: number;
  simulatorEventSdkTypeName: string;
  eventCode: string;
}

export interface IntegrationType {
  id: number;
  name: string;
}

export enum SimulatorEventType {
  OutputFromSimulator,
  InputToSimulator,
}

export enum SimulatorSoftware {
  MsFs2020,
}

export enum SimulatorEventSdkType {
  OpenA3XXWasmGauge,
  SimConnectDirect,
  FSUIPC,
  WebSockets,
}

export interface MapExtenderBitToHardwareInputSelectorDto {
  hardwareInputSelectorId: number;
  hardwareBoardId: number;
  hardwareExtenderBusId: number;
  hardwareExtenderBusBitId: number;
}

export interface MapExtenderBitToHardwareOutputSelectorDto {
  hardwareOutputSelectorId: number;
  hardwareBoardId: number;
  hardwareExtenderBusId: number;
  hardwareExtenderBusBitId: number;
}

export interface SimulatorEventItemDto {
  id: number;
  friendlyName: string;
  eventName: string;
  eventCode: string;
}

export interface AddHardwarePanelDto {
  name: string;
  aircraftModel: number;
  cockpitArea: number;
  owner: number;
}

export interface AircraftModelDto {
  id: number;
  name: string;
  manufacturer: string;
  type: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddAircraftModelDto {
  name: string;
  manufacturer: string;
  type: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateAircraftModelDto {
  id: number;
  name: string;
  manufacturer: string;
  type: string;
  description?: string;
  isActive: boolean;
}
