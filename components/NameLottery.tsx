import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Shuffle, Trash2 } from 'lucide-react';

export function NameLottery() {
  const [nameInput, setNameInput] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [drawnName, setDrawnName] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const addName = () => {
    const trimmedName = nameInput.trim();
    if (trimmedName && !names.includes(trimmedName)) {
      setNames([...names, trimmedName]);
      setNameInput('');
    }
  };

  const removeName = (nameToRemove: string) => {
    setNames(names.filter(name => name !== nameToRemove));
  };

  const drawName = () => {
    if (names.length === 0) return;
    
    setIsDrawing(true);
    setDrawnName(null);
    
    // Add some animation delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      const selectedName = names[randomIndex];
      setDrawnName(selectedName);
      setNames(names.filter((_, index) => index !== randomIndex));
      setIsDrawing(false);
    }, 1000);
  };

  const clearAll = () => {
    setNames([]);
    setDrawnName(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addName();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Name Lottery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Name Input */}
        <div className="flex gap-2">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a name..."
            className="flex-1"
          />
          <Button onClick={addName} disabled={!nameInput.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Names Pool */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3>Names Pool ({names.length})</h3>
            {names.length > 0 && (
              <Button onClick={clearAll} variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {names.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-muted rounded-lg">
              {names.map((name, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeName(name)}
                >
                  {name} ×
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-muted rounded-lg text-muted-foreground">
              No names added yet
            </div>
          )}
        </div>

        {/* Draw Button */}
        <Button 
          onClick={drawName} 
          disabled={names.length === 0 || isDrawing}
          className="w-full"
          size="lg"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isDrawing ? 'Drawing...' : 'Draw Name'}
        </Button>

        {/* Drawn Name Display */}
        {(drawnName || isDrawing) && (
          <div className="text-center p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
            {isDrawing ? (
              <div className="space-y-2">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground">Drawing a name...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Winner:</p>
                <p className="text-3xl text-primary animate-pulse">{drawnName}</p>
              </div>
            )}
          </div>
        )}

        {names.length === 0 && drawnName && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">All names have been drawn!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}