import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../question/question.service';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit {

  constructor(private readonly questionService: QuestionsService) { }

  ngOnInit() {
  }

  public startQuiz(): void {
    this.questionService.toggleQuestions(true);
  }

}
