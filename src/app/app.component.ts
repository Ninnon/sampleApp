import { Component } from '@angular/core';
import { QuestionsService } from './question/question.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor(private readonly questionService: QuestionsService) {}

  public showQuiz(): boolean {
    return this.questionService.showQuestions;
  }

}
