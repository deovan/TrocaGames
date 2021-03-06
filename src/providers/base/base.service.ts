import { Platform } from 'ionic-angular';
import { Response } from '@angular/http'
import { Observable } from 'rxjs'
import firebase from 'firebase'
declare var window: any

const extractError = (error: Response | any): string => {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || ''
        const err = body.error || JSON.stringify(body)
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
        errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)

    return errMsg
}

export abstract class BaseService {

    protected handlePromiseError(error: Response | any): Promise<any> {
        return Promise.reject(extractError(error))
    }

    protected handleObservableError(error: Response | any): Observable<any> {
        return Observable.throw(extractError(error))
    }

    makeFileIntoBlob(_imagePath) {
        console.log('make', _imagePath);
        // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
                console.log('window resolve', fileEntry);

                fileEntry.file((resFile) => {
                    var reader = new FileReader();
                    reader.onloadend = (evt: any) => {
                        console.log('evt', evt);
                        var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
                        imgBlob.name = 'sample.jpg';
                        console.log(imgBlob);
                        resolve(imgBlob);
                    };
                    reader.onerror = (e) => {
                        console.log('Failed file read: ' + e.toString());
                        reject(e);
                    };
                    reader.readAsArrayBuffer(resFile);
                });
            });
        });

    }




}