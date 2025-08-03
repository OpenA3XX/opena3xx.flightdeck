import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  AddHardwarePanelDto,
  AddHardwareInputDto,
  AddHardwareInputSelectorDto,
  AddHardwareOutputDto,
  AddHardwareOutputSelectorDto,
  AircraftModelDto,
  HardwareBoardDto,
  HardwareInputDto,
  HardwareInputSelectorDto,
  HardwareInputTypeDto,
  HardwareOutputDto,
  HardwareOutputSelectorDto,
  HardwareOutputTypeDto,
  HardwarePanelOverviewDto,
  MapExtenderBitToHardwareInputSelectorDto,
  MapExtenderBitToHardwareOutputSelectorDto,
} from '../../shared/models/models';
import { ConfigurationService } from './configuration.service';

interface HttpOptions {
  headers: HttpHeaders;
}

interface ConfigurationData {
  [key: string]: unknown;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

@Injectable()
export class DataService {
  private httpOptions: HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private configurationService: ConfigurationService) {
  }

  private get BASE_URL(): string {
    return this.configurationService.getApiBaseUrl();
  }

  get(url: string) {
    return this.http.get(url);
  }

  getAllHardwarePanelOverviewDetails() {
    return this.http.get<HardwarePanelOverviewDto[]>(`${this.BASE_URL}/hardware-panel/overview/all`);
  }

  getAllHardwarePanelDetails(id: number) {
    return this.http.get(`${this.BASE_URL}/hardware-panel/details/${id}`);
  }

  getAllHardwareInputTypes() {
    return this.http.get(`${this.BASE_URL}/hardware-input-types`);
  }

  getHardwareInputTypeById(id: number) {
    return this.http.get(`${this.BASE_URL}/hardware-input-types/${id}`);
  }

  updateHardwareInputType(hardwareInputTypeDto: HardwareInputTypeDto) {
    return this.http.patch(`${this.BASE_URL}/hardware-input-types`, hardwareInputTypeDto);
  }

  deleteHardwareInputType(id: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-input-types/${id}`);
  }

  getAllHardwareOutputTypes() {
    return this.http.get(`${this.BASE_URL}/hardware-output-types`);
  }

  getHardwareOutputTypeById(id: number) {
    return this.http.get(`${this.BASE_URL}/hardware-output-types/${id}`);
  }

  updateHardwareOutputType(hardwareOutputTypeDto: HardwareOutputTypeDto) {
    return this.http.patch(`${this.BASE_URL}/hardware-output-types`, hardwareOutputTypeDto);
  }

  deleteHardwareOutputType(id: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-output-types/${id}`);
  }

  getAllSimulatorEvents() {
    return this.http.get(`${this.BASE_URL}/simulator-event/all`);
  }

  getAllSimulatorEventsByIntegrationType(integrationTypeId: number) {
    return this.http.get(`${this.BASE_URL}/simulator-event?integrationTypeId=${integrationTypeId}`);
  }

  getAllIntegrationTypes() {
    return this.http.get(`${this.BASE_URL}/simulator-event/integration-types/all`);
  }

  getSettingsForm() {
    return this.http.get(`${this.BASE_URL}/forms/settings`);
  }
  getSimLinkInputSelectorForm(hardwareInputSelectorId: number) {
    return this.http.get(
      `${this.BASE_URL}/forms/sim-link/input-selector/${hardwareInputSelectorId}`
    );
  }
  getHardwareBoardForHardwareInputSelectorForm(hardwareInputSelectorId: number) {
    return this.http.get(
      `${this.BASE_URL}/forms/hardware-board-link/input-selector/${hardwareInputSelectorId}`
    );
  }

  getAllConfiguration() {
    return this.http.get(`${this.BASE_URL}/configuration`);
  }

  updateAllConfiguration(data: ConfigurationData) {
    console.log(data);
    return this.http.post<ApiResponse<ConfigurationData>>(`${this.BASE_URL}/configuration`, data);
  }

  linkSimulatorEventToHardwareInputSelector(hardwareInputSelectorId: number, eventCode: string) {
    //Change to this endpoint to use autocomplete in admin ui
    // `${this.BASE_URL}/simulator-event/link/hardware-input-selector/${hardwareInputSelectorId}/${simulatorEventId}`,
    return this.http.post<ApiResponse<unknown>>(
      `${this.BASE_URL}/simulator-event/link/hardware-input-selector/by-event-code/${hardwareInputSelectorId}/${eventCode}`,
      {}
    );
  }

  getHardwareInputSelectorDetails(hardwareInputSelectorId: number) {
    return this.http.get(`${this.BASE_URL}/hardware-input-selectors/${hardwareInputSelectorId}`);
  }

  sendSimulatorTestEvent(simulatorEventId: number) {
    return this.http.put<ApiResponse<unknown>>(`${this.BASE_URL}/simulator-event/test/${simulatorEventId}`, {});
  }

  /**
   * Check API health status with a ping request
   * Uses X-Skip-Loading header to prevent loading indicator from flashing
   */
  async checkApiHealth() {
    try {
      const data = await this.http
        .get(`${this.BASE_URL}/core/heartbeat/ping`, {
          responseType: 'text',
          headers: {
            'X-Skip-Loading': 'true'
          }
        })
        .toPromise();
      if (data === '"Pong from OpenA3XX"') {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  addHardwareInputType(hardwareInputTypeDto: HardwareInputTypeDto) {
    return this.http.post<HardwareInputTypeDto>(
      `${this.BASE_URL}/hardware-input-types`,
      hardwareInputTypeDto
    );
  }

  addHardwareOutputType(hardwareInputTypeDto: HardwareInputTypeDto) {
    return this.http.post<HardwareInputTypeDto>(
      `${this.BASE_URL}/hardware-output-types`,
      hardwareInputTypeDto
    );
  }

  getAllHardwareBoards() {
    return this.http.get(`${this.BASE_URL}/hardware-boards/all`);
  }

  addHardwareBoards(harwareBoardDto: HardwareBoardDto) {
    return this.http.post<HardwareBoardDto>(
      `${this.BASE_URL}/hardware-boards/add`,
      harwareBoardDto
    );
  }

  getHardwareBoardDetails(id: number) {
    return this.http.get(`${this.BASE_URL}/hardware-boards/${id}`);
  }

  mapExtenderBitToHardwareInputSelector(
    linkExtenderBitToHardwareInputSelectorDto: MapExtenderBitToHardwareInputSelectorDto
  ) {
    return this.http.post<MapExtenderBitToHardwareInputSelectorDto>(
      `${this.BASE_URL}/hardware-boards/link/hardware-input-selector`,
      linkExtenderBitToHardwareInputSelectorDto
    );
  }

  unmapHardwareInputSelector(hardwareInputSelectorId: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-boards/unmap/hardware-input-selector/${hardwareInputSelectorId}`);
  }

  getHardwareBoardAssociationForHardwareInputSelector(hardwareInputSelectorId: number) {
    return this.http.get(
      `${this.BASE_URL}/hardware-boards/hardware-input-selector/${hardwareInputSelectorId}`
    );
  }

  addHardwarePanel(hardwarePanel: AddHardwarePanelDto) {
    return this.http.post<AddHardwarePanelDto>(
      `${this.BASE_URL}/hardware-panel/add`,
      hardwarePanel
    );
  }

  getHardwareBoardAssociationForHardwareOutputSelector(hardwareOutputSelectorId: number) {
    return this.http.get(
      `${this.BASE_URL}/hardware-boards/hardware-output-selector/${hardwareOutputSelectorId}`
    );
  }

  mapExtenderBitToHardwareOutputSelector(
    linkExtenderBitToHardwareOutputSelectorDto: MapExtenderBitToHardwareOutputSelectorDto
  ) {
    return this.http.post<MapExtenderBitToHardwareOutputSelectorDto>(
      `${this.BASE_URL}/hardware-boards/link/hardware-output-selector`,
      linkExtenderBitToHardwareOutputSelectorDto
    );
  }

  unmapHardwareOutputSelector(hardwareOutputSelectorId: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-boards/unmap/hardware-output-selector/${hardwareOutputSelectorId}`);
  }

  // Hardware Input API Methods
  getAllHardwareInputs(panelId?: number) {
    const url = panelId
      ? `${this.BASE_URL}/hardware-inputs/all?panelId=${panelId}`
      : `${this.BASE_URL}/hardware-inputs/all`;
    return this.http.get<HardwareInputDto[]>(url);
  }

  getHardwareInputById(id: number) {
    return this.http.get<HardwareInputDto>(`${this.BASE_URL}/hardware-inputs/${id}`);
  }

  addHardwareInput(hardwareInputDto: AddHardwareInputDto) {
    return this.http.post<HardwareInputDto>(`${this.BASE_URL}/hardware-inputs`, hardwareInputDto);
  }

  updateHardwareInput(hardwareInputDto: HardwareInputDto) {
    return this.http.patch<HardwareInputDto>(`${this.BASE_URL}/hardware-inputs`, hardwareInputDto);
  }

  deleteHardwareInput(id: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-inputs/${id}`);
  }

  deleteHardwarePanel(id: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-panel/${id}`);
  }

  updateHardwarePanel(id: number, hardwarePanelDto: AddHardwarePanelDto) {
    return this.http.patch<AddHardwarePanelDto>(`${this.BASE_URL}/hardware-panel/${id}`, hardwarePanelDto);
  }

  updateHardwareBoard(id: number, hardwareBoardDto: HardwareBoardDto) {
    return this.http.patch<HardwareBoardDto>(`${this.BASE_URL}/hardware-boards/${id}`, hardwareBoardDto);
  }

  deleteHardwareBoard(id: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-boards/${id}`);
  }

  // Hardware Input Selector API Methods
  addHardwareInputSelector(hardwareInputId: number, selector: AddHardwareInputSelectorDto) {
    return this.http.post<HardwareInputSelectorDto>(`${this.BASE_URL}/hardware-input-selectors`, {
      name: selector.name,
      hardwareInputId: hardwareInputId
    });
  }

  deleteHardwareInputSelector(hardwareInputId: number, selectorId: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-input-selectors/${selectorId}`);
  }

  // Hardware Output API Methods
  getAllHardwareOutputs(panelId?: number) {
    const url = panelId
      ? `${this.BASE_URL}/hardware-outputs/all?panelId=${panelId}`
      : `${this.BASE_URL}/hardware-outputs/all`;
    return this.http.get<HardwareOutputDto[]>(url);
  }

  getHardwareOutputById(id: number) {
    return this.http.get<HardwareOutputDto>(`${this.BASE_URL}/hardware-outputs/${id}`);
  }

  addHardwareOutput(hardwareOutputDto: AddHardwareOutputDto) {
    return this.http.post<HardwareOutputDto>(`${this.BASE_URL}/hardware-outputs`, hardwareOutputDto);
  }

  updateHardwareOutput(hardwareOutputDto: HardwareOutputDto) {
    return this.http.patch<HardwareOutputDto>(`${this.BASE_URL}/hardware-outputs`, hardwareOutputDto);
  }

  deleteHardwareOutput(id: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-outputs/${id}`);
  }

  // Hardware Output Selector API Methods
  addHardwareOutputSelector(hardwareOutputId: number, selector: AddHardwareOutputSelectorDto) {
    return this.http.post<HardwareOutputSelectorDto>(`${this.BASE_URL}/hardware-output-selectors`, {
      name: selector.name,
      hardwareOutputId: hardwareOutputId
    });
  }

  deleteHardwareOutputSelector(hardwareOutputId: number, selectorId: number) {
    return this.http.delete(`${this.BASE_URL}/hardware-output-selectors/${selectorId}`);
  }

  // Aircraft Models API Methods
  getAllAircraftModels() {
    return this.http.get<AircraftModelDto[]>(`${this.BASE_URL}/aircraft-models`);
  }
}
