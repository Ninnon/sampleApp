import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomCheckboxComponent } from './custom-checkbox/custom-checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { QuestionsComponent } from './questions/questions.component';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results/results.component';
@NgModule({
  declarations: [
    AppComponent,
    CustomCheckboxComponent,
    HeaderComponent,
    QuestionsComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
