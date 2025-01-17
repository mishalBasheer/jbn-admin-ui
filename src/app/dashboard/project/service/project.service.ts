import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private AUTH_API = environment.API_ENDPOINT;
  $ProjectNavigateDataTransfer = new EventEmitter();
  $ProjectFormOpenDataTransfer = new EventEmitter<number>();

  constructor(private http: HttpClient) {}

  // create the project APO
  createProject(obj: any) {
    return this.http.post<any>(`${this.AUTH_API}/project/add`, obj);
  }

  // get all Project API data
  getAllProjects() {
    return this.http.post<any>(`${this.AUTH_API}/project/list`, {});
  }

  // get Project by ID API data
  getProjectById(id: string) {
    return this.http.post<any>(`${this.AUTH_API}/project/${id}`, {});
  }

  // Project File Upload API
  projectFileUpload(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/fileUpload/${orderID}`,
      obj
    );
  }

  // Approve Status Drawing approve and submit API
  approveStatusDrawing(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/drawing-upload/${orderID}`,
      obj
    );
  }

  // Approve status material report API
  approveStatusMaterialEstimate(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/material-upload/${orderID}`,
      obj
    );
  }

  // Approve status Conformation API
  approveStatusConformation(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/confirmation/${orderID}`,
      obj
    );
  }

  // Approve status Arraival API
  approveStatusArraival(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/arrival/${orderID}`,
      obj
    );
  }

  // Approve status Production API
  approveStatusProduction(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/production/${orderID}`,
      obj
    );
  }

  // Approve status Delivary API
  approveStatusDelivery(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/delivery/${orderID}`,
      obj
    );
  }

  // Approve status installation API
  approveStatusInstallation(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/installation/${orderID}`,
      obj
    );
  }

  // Approve status Awaiting Service API
  approveStatusAwaitingService(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/awaiting-service/${orderID}`,
      obj
    );
  }

  // Approve status Service API
  approveStatusService(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/service/${orderID}`,
      obj
    );
  }

  // Approve status Closed API
  approveStatusClose(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/close/${orderID}`,
      obj
    );
  }

  // Approve status Cancell API
  approveStatusCancell(obj: any, orderID: string) {
    return this.http.post<any>(
      `${this.AUTH_API}/project/cancel/${orderID}`,
      obj
    );
  }
}
