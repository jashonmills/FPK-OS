import { ALL_SCENARIOS } from './game-data';

export interface GameState {
  phase: 'PLAN' | 'LIVE' | 'WEEKLY_SUMMARY' | 'REFLECT' | 'SCENARIO_OUTCOME';
  week: number;
  month: number;
  scenarioIndex: number;
  balance: number;
  monthlyIncome: number;
  monthlyNeeds: number;
  savingsGoal: number;
  currentSavings: number;
  currentEmergencyFund: number;
  currentDebt: number;
  creditCardBalance: number;
  creditCardLimit: number;
  creditCardInterestRate: number;
  debtInterestRate: number;
  envelopes: {
    Needs: number;
    Wants: number;
    Savings: number;
    Emergency: number;
  };
  creditCardPayment: number;
  creditScore: number;
  score: number;
  streak: number;
  wiseChoices: number;
  isGameOver: boolean;
  gameStatus: string | null;
  currentScenario: any;
  weeklyScenarios: any[];
  feedbackMessage: string | null;
  isMiniGameActive: boolean;
  weekLog: any[];
  monthlyLog: any[];
  ledgerTransactions: any[];
  lastChoice: {
    scenario: any;
    option: any;
    balanceChange: number;
    creditChange: number;
    debtChange: number;
    scoreChange: number;
  } | null;
}

export const initialState: GameState = {
  phase: 'PLAN',
  week: 1,
  month: 1,
  scenarioIndex: 0,
  balance: 500,
  monthlyIncome: 800,
  monthlyNeeds: 400,
  savingsGoal: 200,
  currentSavings: 0,
  currentEmergencyFund: 0,
  currentDebt: 0,
  creditCardBalance: 0,
  creditCardLimit: 500,
  creditCardInterestRate: 0.18,
  debtInterestRate: 0.12,
  envelopes: {
    Needs: 0,
    Wants: 0,
    Savings: 0,
    Emergency: 0
  },
  creditCardPayment: 0,
  creditScore: 650,
  score: 100,
  streak: 0,
  wiseChoices: 0,
  isGameOver: false,
  gameStatus: null,
  currentScenario: null,
  weeklyScenarios: [],
  feedbackMessage: null,
  isMiniGameActive: false,
  weekLog: [],
  monthlyLog: [],
  ledgerTransactions: [],
  lastChoice: null
};

type GameAction = 
  | { type: 'ALLOCATE_BUDGET'; category: string; amount: number }
  | { type: 'START_SCENARIOS' }
  | { type: 'MAKE_CHOICE'; option: any }
  | { type: 'ADVANCE_SCENARIO' }
  | { type: 'NEXT_WEEK' }
  | { type: 'START_NEW_MONTH' }
  | { type: 'GAME_OVER'; status: string }
  | { type: 'RESET_GAME' }
  | { type: 'MANUAL_TRANSACTION'; logEntry: any; newBalance: number }
  | { type: 'CONTINUE_FROM_OUTCOME' }
  | { type: 'GO_TO_SCENARIO'; payload: { scenarioIndex: number; scenario: any } };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ALLOCATE_BUDGET':
      if (action.category === 'Credit Card Payment') {
        return {
          ...state,
          creditCardPayment: action.amount
        };
      } else {
        return {
          ...state,
          envelopes: {
            ...state.envelopes,
            [action.category]: action.amount
          }
        };
      }

    case 'START_SCENARIOS': {
      // Select random scenarios for the week
      const shuffledScenarios = [...ALL_SCENARIOS].sort(() => 0.5 - Math.random());
      const weeklyScenarios = shuffledScenarios.slice(0, 5);
      
      return {
        ...state,
        phase: 'LIVE',
        weeklyScenarios,
        currentScenario: weeklyScenarios[0],
        scenarioIndex: 0,
        feedbackMessage: null
      };
    }

    case 'MAKE_CHOICE': {
      const { option } = action;
      const feedback = option.feedback || "Decision recorded.";
      
      // Store original state for calculating changes
      const originalBalance = state.balance;
      const originalCredit = state.creditScore;
      const originalScore = state.score;
      const originalDebt = state.currentDebt + state.creditCardBalance;
      
      // Parse the impact and apply it to the state
      let newBalance = state.balance;
      let newCurrentSavings = state.currentSavings;
      let newCurrentEmergencyFund = state.currentEmergencyFund;
      let newDebt = state.currentDebt;
      let newCreditCardBalance = state.creditCardBalance;
      let newEnvelopes = { ...state.envelopes };
      let newScore = state.score;
      let newCredit = state.creditScore;
      let newStreak = state.streak;
      let newWiseChoices = state.wiseChoices;

      // Apply the financial impact based on the option
        if (option.impact) {
        const impacts = option.impact.toLowerCase().split(',').map((s: string) => s.trim());
        
        impacts.forEach((impact: string) => {
          if (impact.includes('income:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newBalance += amount;
            newScore += 5;
          } else if (impact.includes('balance:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newBalance += amount;
          } else if (impact.includes('wants:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newEnvelopes.Wants += amount;
            newBalance += amount;
          } else if (impact.includes('savings:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newCurrentSavings += amount;
            newScore += amount > 0 ? 10 : -5;
          } else if (impact.includes('emergency:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newCurrentEmergencyFund += amount;
            newScore += amount > 0 ? 15 : -10;
          } else if (impact.includes('credit:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newCredit += amount;
          } else if (impact.includes('score:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newScore += amount;
          } else if (impact.includes('creditcard:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newCreditCardBalance += amount;
            newScore -= 2; // Small penalty for using credit
          } else if (impact.includes('needs:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newEnvelopes.Needs += amount;
            newBalance += amount;
          } else if (impact.includes('debt:')) {
            const amount = parseFloat(impact.split(':')[1].replace(/[^0-9.-]/g, ''));
            newDebt += amount;
            newScore -= amount > 0 ? 5 : 5; // Penalty for taking on debt
          }
        });

        // Track wise choices
        if (newScore > state.score) {
          newWiseChoices += 1;
          newStreak += 1;
        } else if (newScore < state.score) {
          newStreak = 0;
        }
      }

      // Create log entry
      const logEntry = {
        type: 'Scenario',
        title: state.currentScenario?.title || 'Decision',
        option: option.text,
        impact: option.impact,
        feedback,
        date: new Date().toLocaleDateString(),
        week: state.week,
        month: state.month,
        amount: newBalance - state.balance,
        balanceAfter: newBalance
      };

      // Calculate changes for outcome summary
      const balanceChange = newBalance - originalBalance;
      const creditChange = newCredit - originalCredit;
      const debtChange = (newDebt + newCreditCardBalance) - originalDebt;
      const scoreChange = newScore - originalScore;

      return {
        ...state,
        phase: 'SCENARIO_OUTCOME',
        balance: Math.max(0, newBalance),
        currentSavings: Math.max(0, newCurrentSavings),
        currentEmergencyFund: Math.max(0, newCurrentEmergencyFund),
        currentDebt: Math.max(0, newDebt),
        creditCardBalance: Math.max(0, newCreditCardBalance),
        envelopes: newEnvelopes,
        creditScore: Math.max(300, Math.min(850, newCredit)),
        score: Math.max(0, newScore),
        streak: newStreak,
        wiseChoices: newWiseChoices,
        feedbackMessage: feedback,
        weekLog: [...state.weekLog, logEntry],
        monthlyLog: [...state.monthlyLog, logEntry],
        lastChoice: {
          scenario: state.currentScenario,
          option,
          balanceChange,
          creditChange,
          debtChange,
          scoreChange
        }
      };
    }

    case 'CONTINUE_FROM_OUTCOME': {
      const nextIndex = state.scenarioIndex + 1;
      console.log('CONTINUE_FROM_OUTCOME - Current scenarioIndex:', state.scenarioIndex, 'Next index:', nextIndex, 'weeklyScenarios length:', state.weeklyScenarios.length);
      
      if (nextIndex >= 5) {
        // All 5 scenarios completed, go to weekly summary
        return {
          ...state,
          phase: 'WEEKLY_SUMMARY',
          feedbackMessage: null,
          lastChoice: null
        };
      } else {
        // Continue to next scenario
        return {
          ...state,
          scenarioIndex: nextIndex,
          phase: 'LIVE',
          currentScenario: state.weeklyScenarios[nextIndex],
          feedbackMessage: null,
          lastChoice: null
        };
      }
    }

    case 'ADVANCE_SCENARIO': {
      const nextIndex = state.scenarioIndex + 1;
      const nextPhase = nextIndex >= state.weeklyScenarios.length ? 'WEEKLY_SUMMARY' : 'LIVE';
      
      return {
        ...state,
        scenarioIndex: nextIndex,
        phase: nextPhase,
        currentScenario: nextPhase === 'LIVE' ? state.weeklyScenarios[nextIndex] : null,
        feedbackMessage: null
      };
    }

    case 'NEXT_WEEK': {
      const nextWeek = state.week + 1;
      const nextPhase = nextWeek > 4 ? 'REFLECT' : 'PLAN';
      
      console.log('NEXT_WEEK reducer - Current week:', state.week, 'Next week:', nextWeek, 'Next phase:', nextPhase);
      
      // Apply interest if there's debt
      let newDebt = state.currentDebt;
      let newCreditCardBalance = state.creditCardBalance;
      let newCreditScore = state.creditScore;
      
      if (newDebt > 0) {
        const debtInterest = newDebt * (state.debtInterestRate / 12);
        newDebt += debtInterest;
        newCreditScore -= 5;
      }
      
      if (newCreditCardBalance > 0) {
        const ccInterest = newCreditCardBalance * (state.creditCardInterestRate / 12);
        newCreditCardBalance += ccInterest;
        newCreditScore -= 5;
      }

      return {
        ...state,
        phase: nextPhase,
        week: nextWeek,
        monthlyLog: [...state.monthlyLog, ...state.weekLog],
        weekLog: [],
        scenarioIndex: 0,
        currentScenario: null,
        weeklyScenarios: [], // Reset for new week
        currentDebt: newDebt,
        creditCardBalance: newCreditCardBalance,
        creditScore: Math.max(300, Math.min(850, newCreditScore)),
        feedbackMessage: null
      };
    }

    case 'START_NEW_MONTH':
      return {
        ...state,
        phase: 'PLAN',
        week: 1,
        month: state.month + 1,
        feedbackMessage: null,
        monthlyLog: [],
        weekLog: [],
        envelopes: { Needs: 0, Wants: 0, Savings: 0, Emergency: 0 }
      };

    case 'GAME_OVER':
      return {
        ...state,
        isGameOver: true,
        gameStatus: action.status,
        phase: 'REFLECT'
      };

    case 'RESET_GAME':
      return initialState;

    case 'MANUAL_TRANSACTION':
      return {
        ...state,
        balance: action.newBalance,
        ledgerTransactions: [...state.ledgerTransactions, action.logEntry]
      };

    case 'GO_TO_SCENARIO':
      return {
        ...state,
        phase: 'LIVE',
        scenarioIndex: action.payload.scenarioIndex,
        currentScenario: action.payload.scenario,
        feedbackMessage: null,
        lastChoice: null
      };

    default:
      return state;
  }
};