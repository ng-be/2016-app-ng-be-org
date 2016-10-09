// 3d party imports
import { Component } from '@angular/core';

// app imports
import { ConferenceDataService } from '../../services';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  private mapData = [
    {
      name: 'Holiday Inn - Ghent expo',
      lat: 51.0259671,
      lng: 3.6895503,
      center: true
    },
    {
      name: 'Ghent - St Pieters - Railway Station',
      lat: 51.036043,
      lng: 3.710872,
      center: false
    }
  ];

  constructor(public conferenceData: ConferenceDataService) {
  }

  ionViewDidLoad() {


    let mapEle = document.getElementById('map');

    let map = new google.maps.Map(mapEle, {
      center: this.mapData.find(d => d.center),
      zoom: 13
    });

    this.mapData.forEach(markerData => {
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


  }

}
