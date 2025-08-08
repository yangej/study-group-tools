import { CountdownTimer } from './components/CountdownTimer';
import { NameLottery } from './components/NameLottery';

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col gap-6">
        {/* Top Half - Countdown Timer */}
        <div className="flex-1 flex items-center justify-center">
          <CountdownTimer />
        </div>
        
        {/* Divider */}
        <div className="border-t border-border"></div>
        
        {/* Bottom Half - Name Lottery */}
        <div className="flex-1 flex items-center justify-center">
          <NameLottery />
        </div>
      </div>
    </div>
  );
}