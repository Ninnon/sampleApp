import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultsService } from "../results/results.service";
import { TimerService } from "../timer/timer.service";

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

  private allQuestionsCompletedSubject: Subject<void> = new Subject();
  public allQuestionsCompleted$ = this.allQuestionsCompletedSubject.asObservable();

  private answerSubmittedBs: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public answerSubmitted$: Observable<boolean> = this.answerSubmittedBs.asObservable();

  private currentQuestionIndexBs: BehaviorSubject<number> = new BehaviorSubject(0);
  public currentQuestionIndex$: Observable<number> = this.currentQuestionIndexBs.asObservable();

  public showQuestions = false;

  public questions$: Observable<IQuestion[]> = of([
    {
      id: 1,
      question: 'What is Karl Malone\'s record for most points scored in a single game during the 1990s?',
      options: [
        {
          option: 1,
          text: '37',
        },
        {
          option: 2,
          text: '48',
        },
        {
          option: 3,
          text: '53',
        },
        {
          option: 4,
          text: '61',
        }
      ],
      correctAnswer: 4
    },
    {
      id: 2,
      question: 'What year did the Jazz move to Utah?',
      options: [
        {
          option: 1,
          text: '1961',
        },
        {
          option: 2,
          text: '1973',
        },
        {
          option: 3,
          text: '1979',
        },
        {
          option: 4,
          text: '1984',
        }
      ],
      correctAnswer: 3
    },
    {
      id: 3,
      question: 'Who did Jerry Sloan replace as the coach of the Jazz?',
      options: [
        {
          option: 1,
          text: 'Frank Layden',
        },
        {
          option: 2,
          text: 'Tom Nissalke',
        },
        {
          option: 3,
          text: 'Elgin Baylor',
        },
        {
          option: 4,
          text: 'Tyrone Corbin',
        }
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'How many career assists did John Stockton have when he retired in 2003?',
      options: [
        {
          option: 1,
          text: '15,086',
        },
        {
          option: 2,
          text: '13,126',
        },
        {
          option: 3,
          text: '14,980',
        },
        {
          option: 4,
          text: '11,541',
        }
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'Who received the name \'High Flyin\'?',
      options: [
        {
          option: 1,
          text: 'Greg Ostertag',
        },
        {
          option: 2,
          text: 'Bryon Russell',
        },
        {
          option: 3,
          text: 'Jeff Hornacek',
        },
        {
          option: 4,
          text: 'Donyell Marshall',
        }
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: 'Which of the following has NOT been a place the Jazz have called home?',
      options: [
        {
          option: 1,
          text: 'Delta Center',
        },
        {
          option: 2,
          text: 'Energy Solutions Arena',
        },
        {
          option: 3,
          text: 'Qualtrics Center',
        },
        {
          option: 4,
          text: 'Vivint Smart Home Arena',
        }
      ],
      correctAnswer: 3
    },
    {
      id: 7,
      question: 'Who was the No.1 pick of the Jazz during the 1982 NBA draft?',
      options: [
        {
          option: 1,
          text: 'Terry Cummings',
        },
        {
          option: 2,
          text: 'Bill Garnett',
        },
        {
          option: 3,
          text: 'Dominique Wilkins',
        },
        {
          option: 4,
          text: 'Jerry Eaves',
        }
      ],
      correctAnswer: 3
    },
    {
      id: 8,
      question: 'From where did the Utah Jazz relocate?',
      options: [
        {
          option: 1,
          text: 'Seattle',
        },
        {
          option: 2,
          text: 'New Orleans',
        },
        {
          option: 3,
          text: 'Memphis',
        },
        {
          option: 4,
          text: 'Dallas',
        }
      ],
      correctAnswer: 2
    },
    {
      id: 9,
      question: 'How many teams had Jeff Hornacek played on before retiring in 2000?',
      options: [
        {
          option: 1,
          text: 'Three',
        },
        {
          option: 2,
          text: 'One',
        },
        {
          option: 3,
          text: 'Two',
        },
        {
          option: 4,
          text: 'Four',
        }
      ],
      correctAnswer: 1
    },
    {
      id: 10,
      question: 'Who is the Jazz\'s all-time leader in shot blocks?',
      options: [
        {
          option: 1,
          text: 'Greg Ostertag',
        },
        {
          option: 2,
          text: 'Andrei Kirilenko',
        },
        {
          option: 3,
          text: 'Thurl Bailey',
        },
        {
          option: 4,
          text: 'Mark Eaton',
        }
      ],
      correctAnswer: 4
    },
  ]);

  public currentQuestion$: Observable<IQuestion> = combineLatest(this.questions$, this.currentQuestionIndex$).pipe(
    map((([questions, index]) => questions[index]))
  );

  public currentQuestionCorrectAnswerText$: Observable<string> = this.currentQuestion$.pipe(
    map(question => question.options.find(option => option.option === question.correctAnswer).text)
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

  public markAllQuestionsAsComplete(): void {
    this.allQuestionsCompletedSubject.next();
  }

  public restartQuestions(): void {
    this.currentQuestionIndexBs.next(0);
    this.answerSubmittedBs.next(false);
    this.totalQuestionsCorrectBs.next(0);
    this.resultsService.resetResults();
  }

public toggleQuestions(showQuestions: boolean) {
    this.showQuestions = showQuestions;
  }
}
