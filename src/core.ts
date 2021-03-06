import {Provider} from 'angular2/core';

import {MapsAPILoader} from './services/maps-api-loader/maps-api-loader';
import {LazyMapsAPILoader} from './services/maps-api-loader/lazy-maps-api-loader';

// main module
export * from './directives';
export * from './services';

export const ANGULAR2_GOOGLE_MAPS_PROVIDERS: any[] = [
  new Provider(MapsAPILoader, {useClass: LazyMapsAPILoader}),
];
