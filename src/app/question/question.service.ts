import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultsService } from "../results/results.service";

export interface IQuestion {
  readonly id: number;
  readonly question: string;
  readonly options: ReadonlyArray<IOption>;
  readonly correctAnswer: number;
}

export interface IOption {
  option: number;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private totalQuestionsCorrectBs: BehaviorSubject<number> = new BehaviorSubject(0);
  public totalQuestionsCorrect$ = this.totalQuestionsCorrectBs.asObservable();

  private answerSubmittedBs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public answerSubmitted$: Observable<boolean> = this.answerSubmittedBs.asObservable();

  private currentQuestionIndexBs: BehaviorSubject<number> = new BehaviorSubject(0);
  public currentQuestionIndex$: Observable<number> = this.currentQuestionIndexBs.asObservable();

  public questions$: Observable<IQuestion[]> = of([
    {
      id: 1,
      question: 'Who is the best God on Smite?',
      options: [
        {
          option: 1,
          text: 'Awilix',
        },
        {
          option: 2,
          text: 'Fenrir',
        },
        {
          option: 3,
          text: 'Ymir',
        },
        {
          option: 4,
          text: 'Discordia',
        }
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'Who is the best person to play as Medusa?',
      options: [
        {
          option: 1,
          text: 'Trenton',
        },
        {
          option: 2,
          text: 'Sarah',
        },
        {
          option: 3,
          text: 'Jeremy',
        },
        {
          option: 4,
          text: 'Jake',
        }
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'Who is the best Jazz player?',
      options: [
        {
          option: 1,
          text: 'Rudy Gobert',
        },
        {
          option: 2,
          text: 'Joe Ingles',
        },
        {
          option: 3,
          text: 'Donovan Mitchell',
        },
        {
          option: 4,
          text: 'Mike Conley',
        }
      ],
      correctAnswer: 3
    },
  ]);

  public currentQuestion$: Observable<IQuestion> = combineLatest(this.questions$, this.currentQuestionIndex$).pipe(
    map((([questions, index]) => questions[index]))
  );

  public addScoreToTotal(): void {
    this.totalQuestionsCorrectBs.next(this.totalQuestionsCorrectBs.getValue() + 1);
  }

  constructor(private readonly resultsService: ResultsService) { }

  public goToNextQuestion(): void {
    this.currentQuestionIndexBs.next(this.currentQuestionIndexBs.getValue() + 1);
  }

  public markQuestionAsAnswered(): void {
    this.answerSubmittedBs.next(true);
  }

  public markQuestionAsUnanswered(): void {
    this.answerSubmittedBs.next(false);
  }

  public restartQuestions(): void {
    this.currentQuestionIndexBs.next(0);
    this.answerSubmittedBs.next(false);
    this.totalQuestionsCorrectBs.next(0);
    this.resultsService.resetResults();
  }
}
