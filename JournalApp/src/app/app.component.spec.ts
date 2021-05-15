import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { MenuComponent } from './layout/menu/menu.component'
import { ErrorHandlerService } from './shared/services/error-handler.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MenuComponent
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorHandlerService,
          multi: true
        },
        { 
          provide: JWT_OPTIONS, 
          useValue: JWT_OPTIONS 
        },
        JwtHelperService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'JournalApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('JournalApp');
  });
});
