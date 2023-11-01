import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  logoFooter: any;
  year: any;
  companyName: any;
  isFacebookActive: boolean;
  isInstagramActive: boolean;
  isTwitterActive: boolean;
  isGitHubActive: boolean;
  isDribbleActive: boolean;
  facebookLink: any;
  instagramLink: any;
  twitterLink: any;
  gitHubLink: any;
  dribbleLink: any;

  constructor() {
    this.logoFooter = 'assets/img/logo-landscape.png';
    this.year = new Date().getFullYear();
    this.companyName = 'PT InJourney Indonesia Persada';

    // Social Media Contoller:
    // Facebook
    this.isFacebookActive = true;
    this.facebookLink = '#';
    // Instagram
    this.isInstagramActive = true;
    this.instagramLink = '#';
    // Twitter
    this.isTwitterActive = true;
    this.twitterLink = '#';
    // GitHub
    this.isGitHubActive = false;
    this.gitHubLink = '#';
    // Dribble
    this.isDribbleActive = false;
    this.dribbleLink = '#';
  }
}
