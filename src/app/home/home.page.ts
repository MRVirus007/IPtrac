import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

declare let L;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ip:string = '';
  city: string = '';
  country_code:string = '';
  timezone_gmt: string = '';
  isp: string = '';
  latitude: string = '';
  longitude: string = '';
  location: string = '';
  search:string='';
  constructor(private http: HttpClient, private api: ApiService) {}
  initializingMap() {
    // call this method before you initialize your map.
    var container = L.DomUtil.get('map');
    if (container != null) {
      container._leaflet_id = null;
    }
  }
  onSub(num) {
    this.setIt(num);
  }

  leafMap(lati, long) {
    const map = L.map('map').setView([lati, long], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | App Developed By : Mohammed Rokerya',
    }).addTo(map);
    map.zoomControl.remove();
    //Map Icon
    //Map Icon
    var blackIcon = L.icon({
      iconUrl: '../../assets/images/icon-location.svg',

      iconSize: [38, 45], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62], // the same for the shadow
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
    var marker = L.marker([this.latitude, this.longitude], {
      icon: blackIcon,
    }).addTo(map);
  }

  setIt(ipman){
    if(this.api.ValidateIPaddress(ipman)){
      this.api.getGEOLocation(ipman).subscribe((res) => {
        this.ip = res['ip'];
        this.city = res['city'];
        this.isp = res['isp'];
        this.latitude = res['latitude'];
        this.longitude = res['longitude'];
        this.timezone_gmt = res['timezone_gmt'];
        this.country_code = res['country_code'];
        //Adding the Map
        this.initializingMap();
        this.leafMap(this.latitude, this.longitude);
      });
    }
    else {
      this.api.getGEO(ipman).subscribe((res) => {
        this.ip = res['ip'];
        this.location = res['location'];
        this.city = this.location['city'];
        this.isp = res['isp'];
        this.latitude = this.location['lat'];
        this.longitude = this.location['lng'];
        this.timezone_gmt = this.location['timezone'];
        this.country_code = this.location['country'];
        //Adding the Map
        this.initializingMap();
        this.leafMap(this.latitude, this.longitude);
      });
    }
  }

  ngOnInit(){
    this.api.getIpAddress().subscribe((res=> {
      this.ip= res['ip'];
      this.setIt(this.ip);
    }));
  }

}
