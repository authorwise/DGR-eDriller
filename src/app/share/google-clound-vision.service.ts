import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleCloundVisionService {

  constructor(public _http: HttpClient) { }

  getLabels(base64Image: any) {
    const body = {
      requests: [
        {
          features: [
            {
              type: "TEXT_DETECTION",
              // "maxResults": 13
            }
          ],
          image: {
            content: base64Image
          }
        }
      ]
    }
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', "Basic ya29.c.KqYBFQhXvU2bGRgFuim7KcmNQ_AI5vaT-raEABBBb0zOobYLT7fU6h36e85P25X2MjvCZ8MkU-8Cgc1ltgW-0rgB7L-0XsWNJ9dLH0ZXEs3b87f-BFNG1CM-crUQpFbE4_81_FR6wjI2w1yX9pImkWh3TsDLv9sslA6T-Aeoy7woCjj0-wrmiR4l5Y8reOrSJJtPDjGJboGF9J-KSFBzJQkOeET8Obx_7Q")
    }
    return this._http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body, header);
  }
}
