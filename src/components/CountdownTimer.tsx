import { useState, useEffect, useRef } from 'react';
import { Button } from '@/lib/ui/button';
import { Input } from '@/lib/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total > 0) {
        setTotalSeconds(total);
        setTimeLeft(total);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setTotalSeconds(0);
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Countdown Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="relative">
            <div 
              className={`text-6xl font-mono ${timeLeft === 0 && totalSeconds > 0 ? 'text-destructive' : 'text-foreground'}`}
            >
              {formatTime(timeLeft)}
            </div>
            {totalSeconds > 0 && (
              <div className="w-full bg-muted rounded-full h-2 mt-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Time Input */}
        <div className="flex gap-2 justify-center items-center">
          <div className="text-center">
            <Input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 text-center"
              disabled={isRunning || timeLeft > 0}
            />
            <label className="text-sm text-muted-foreground">Hours</label>
          </div>
          <span className="text-2xl">:</span>
          <div className="text-center">
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-16 text-center"
              disabled={isRunning || timeLeft > 0}
            />
            <label className="text-sm text-muted-foreground">Minutes</label>
          </div>
          <span className="text-2xl">:</span>
          <div className="text-center">
            <Input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              className="w-16 text-center"
              disabled={isRunning || timeLeft > 0}
            />
            <label className="text-sm text-muted-foreground">Seconds</label>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} variant="secondary" className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {timeLeft === 0 && totalSeconds > 0 && (
          <div className="text-center p-4 bg-destructive/10 rounded-lg">
            <p className="text-destructive">Time's up! ⏰</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}