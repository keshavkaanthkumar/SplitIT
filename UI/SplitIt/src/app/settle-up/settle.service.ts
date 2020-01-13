import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment'

import {settlement} from './settle-model';

@Injectable({
  providedIn: 'root'
})
export class SettleService {
  baseUrl=environment.baseUrl;
  constructor(private http: HttpClient) { }
  public Add(settlement: settlement): Observable<Array<settlement>>{
    const settlement$=this.http.post<settlement[]>(this.baseUrl+'/settlement',settlement);
    return settlement$;
  }
  public Delete(settlementId: string): Observable<any> {
    const deletedSettlement$ = this.http.delete(`${this.baseUrl}/settlement/${settlementId}`);
    return deletedSettlement$;
  }
}
