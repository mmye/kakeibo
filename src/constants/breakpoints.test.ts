import { describe, it, expect } from 'vitest';
import { BREAKPOINTS, isBreakpoint } from './breakpoints';

describe('BREAKPOINTS', () => {
  it('sm (Mobile) が640pxで定義されている', () => {
    expect(BREAKPOINTS.sm).toBe(640);
  });

  it('md (Tablet) が768pxで定義されている', () => {
    expect(BREAKPOINTS.md).toBe(768);
  });

  it('lg (Desktop) が1024pxで定義されている', () => {
    expect(BREAKPOINTS.lg).toBe(1024);
  });

  it('xl (Wide) が1280pxで定義されている', () => {
    expect(BREAKPOINTS.xl).toBe(1280);
  });

  it('2xl が1536pxで定義されている', () => {
    expect(BREAKPOINTS['2xl']).toBe(1536);
  });
});

describe('isBreakpoint', () => {
  describe('sm', () => {
    it('639pxはsmより小さい', () => {
      expect(isBreakpoint(639, 'sm')).toBe(false);
    });

    it('640pxはsm以上', () => {
      expect(isBreakpoint(640, 'sm')).toBe(true);
    });
  });

  describe('md', () => {
    it('767pxはmdより小さい', () => {
      expect(isBreakpoint(767, 'md')).toBe(false);
    });

    it('768pxはmd以上', () => {
      expect(isBreakpoint(768, 'md')).toBe(true);
    });
  });

  describe('lg', () => {
    it('1023pxはlgより小さい', () => {
      expect(isBreakpoint(1023, 'lg')).toBe(false);
    });

    it('1024pxはlg以上', () => {
      expect(isBreakpoint(1024, 'lg')).toBe(true);
    });
  });

  describe('xl', () => {
    it('1279pxはxlより小さい', () => {
      expect(isBreakpoint(1279, 'xl')).toBe(false);
    });

    it('1280pxはxl以上', () => {
      expect(isBreakpoint(1280, 'xl')).toBe(true);
    });
  });
});
