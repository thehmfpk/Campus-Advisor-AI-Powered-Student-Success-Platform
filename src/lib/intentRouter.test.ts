import { describe, expect, it } from 'vitest';
import { routeIntent } from './intentRouter';

describe('routeIntent', () => {
  it('routes coding questions to the Coding Mentor', () => {
    expect(routeIntent("I don't understand recursion.").agent).toBe('coding');
  });

  it('routes career goals to the Career Advisor', () => {
    expect(routeIntent('I want to become a data scientist.').agent).toBe('career');
  });

  it('routes exam questions to the Academic Advisor', () => {
    expect(routeIntent('I have exams next month.').agent).toBe('academic');
  });

  it('routes CV questions to the CV Advisor', () => {
    expect(routeIntent('Improve my CV for a frontend developer job.').agent).toBe('cv');
  });

  it('defaults to academic for ambiguous input', () => {
    expect(routeIntent('hello there').agent).toBe('academic');
  });
});
