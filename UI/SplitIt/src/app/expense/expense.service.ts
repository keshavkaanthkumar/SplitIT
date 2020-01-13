import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { expense } from './expense-model'
import { environment } from '../../environments/environment'



@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  /**
   * To add an expense to database
   * @param Expense 
   */
  public Add(Expense: expense): Observable<Array<expense>> {
    const expense$ = this.http.post<expense[]>(this.baseUrl + '/expense', Expense);
    return expense$;
  }
  /**
   * TO delete an expense
   * @param expenseId 
   */
  public Delete(expenseId: string): Observable<any> {
    const deletedExpense$ = this.http.delete(`${this.baseUrl}/expense/${expenseId}`);
    return deletedExpense$;
  }
  /**
   * To get splitwise authentication url
   */
  public GetSplitWiseAuthUrl(): Observable<any> {
    const authurl$ = this.http.get(this.baseUrl + '/getSplitWiseAuthUrl');
    return authurl$;
  }
  /**
   * To import data from splitwise
   * @param acesssCode 
   */
  public ImportSplitWiseUserData(acesssCode: any) {
    const importedData$ = this.http.get<any>(this.baseUrl + `/importSplitWiseData?accessCode=${acesssCode}`);
    return importedData$;
  }
}
