import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardmsgComponent } from './guardmsg.component';

describe('GuardmsgComponent', () => {
  let component: GuardmsgComponent;
  let fixture: ComponentFixture<GuardmsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardmsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuardmsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
