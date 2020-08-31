import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results/results.component';
import { QuestionComponent } from './question/question.component';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ResultsComponent,
    QuestionComponent,
    JumbotronComponent
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
