import {Injectable} from 'angular2/core';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {SebmGoogleMapMarker} from '../directives/google-map-marker';
import {GoogleMapsAPIWrapper} from './google-maps-api-wrapper';
import {Marker} from './google-maps-types';

@Injectable()
export class MarkerManager {
  private _markers: Map<SebmGoogleMapMarker, Promise<Marker>> =
      new Map<SebmGoogleMapMarker, Promise<Marker>>();

  constructor(private _mapsWrapper: GoogleMapsAPIWrapper) {}

  deleteMarker(marker: SebmGoogleMapMarker): Promise<void> {
    let promise = this._markers.get(marker).then((m: Marker) => m.setMap(null));
    this._markers.delete(marker);
    return promise;
  }

  updateMarkerPosition(marker: SebmGoogleMapMarker): Promise<void> {
    return this._markers.get(marker)
        .then((m: Marker) => m.setPosition({lat: marker.latitude, lng: marker.longitude}));
  }

  updateTitle(marker: SebmGoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setTitle(marker.title));
  }

  updateLabel(marker: SebmGoogleMapMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => {
      const label = m.getLabel();
      label.text = marker.label;
      m.setLabel(label);
    });
  }

  addMarker(marker: SebmGoogleMapMarker) {
    const markerPromise = this._mapsWrapper.createMarker(
        {position: {lat: marker.latitude, lng: marker.longitude}, label: marker.label});
    this._markers.set(marker, markerPromise);
  }

  createClickObserable(marker: SebmGoogleMapMarker): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      this._markers.get(marker)
          .then((m: Marker) => { m.addListener('click', () => { observer.next(null); }); });
    });
  }
}
