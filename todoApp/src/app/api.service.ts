import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL: String = "https://todo-list-cbm-ionic-default-rtdb.europe-west1.firebasedatabase.app/";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  }

  constructor(private http: HttpClient) { }

  /**
   * @param {string} path The completion of the path of the API_URL, ex: "/user.json"
   * @returns Observable: contains the response body as a json object
   */
   getData(path: string): Observable<any> {
    return this.http.get<any>(this.API_URL + path +".json");
  }

  /**
   * @param {string} path The completion of the path of the API_URL, ex: "/todo-content.json"
   * @param {string} body Json string
   * @returns Observable of json object
   */
  putData(path: string, body: any): Observable<any> {
    return this.http.put(this.API_URL + path +".json", body, this.httpOptions);
  }

  /**
   * @param {string} path The completion of the path of the API_URL, ex: "/todo-content.json"
   * @param {string} body Json string
   * @returns Observable of json object
   */
  postData(path: string, body: any): Observable<any> {
    return this.http.post(this.API_URL + path +".json", body, this.httpOptions);
  }

  /**
   * @param {string} path The completion of the path of the API_URL, ex: "/todo-content.json"
   * @returns Observable of the response body as a json object
   */
  deleteData(path: string): Observable<any> {
    return this.http.delete(this.API_URL + path +".json", this.httpOptions);
  }
}
