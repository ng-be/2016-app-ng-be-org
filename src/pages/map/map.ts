// 3d party imports
import { Component } from '@angular/core';

// app imports
import { ConferenceDataService } from '../../providers';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  constructor(public confData: ConferenceDataService) {
  }

  ionViewDidLoad() {
    this.confData.getMap().then(mapData => {
      let mapEle = document.getElementById('map');

      let map = new google.maps.Map(mapEle, {
        center: mapData.find(d => d.center),
        zoom: 13
      });

      mapData.forEach(markerData => {
        let infoWindow = new google.maps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });

        let marker = new google.maps.Marker({
          position: markerData,
          map: map,
          title: markerData.name
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });

    });
  }

}
