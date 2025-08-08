import React, { useState } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";
import { Badge } from "@/lib/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import { Plus, Shuffle, Trash2, RotateCcw, Users } from "lucide-react";

export function NameLottery() {
  const [nameInput, setNameInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [originalGroup, setOriginalGroup] = useState<string[]>([]);
  const [drawnName, setDrawnName] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const addName = () => {
    const trimmedName = nameInput.trim();
    if (trimmedName && !names.includes(trimmedName)) {
      const newNames = [...names, trimmedName];
      setNames(newNames);
      setOriginalGroup(newNames);
      setNameInput("");
    }
  };

  const addBulkNames = () => {
    const trimmedInput = bulkInput.trim();
    if (!trimmedInput) return;

    // Split by both commas and newlines, then clean up
    const newNames = trimmedInput
      .split(/[,\n]/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates

    // Merge with existing names, avoiding duplicates
    const combinedNames = [...names];
    newNames.forEach((name) => {
      if (!combinedNames.includes(name)) {
        combinedNames.push(name);
      }
    });

    setNames(combinedNames);
    setOriginalGroup(combinedNames);
    setBulkInput("");
  };

  const removeName = (nameToRemove: string) => {
    const newNames = names.filter((name) => name !== nameToRemove);
    setNames(newNames);
    setOriginalGroup(newNames);
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
    setOriginalGroup([]);
    setDrawnName(null);
  };

  const resetToOriginalGroup = () => {
    setNames([...originalGroup]);
    setDrawnName(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addName();
    }
  };

  const handleBulkKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      addBulkNames();
    }
  };

  const allDrawn = names.length === 0 && originalGroup.length > 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Name Lottery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Tabs */}
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bulk">Bulk Input</TabsTrigger>
            <TabsTrigger value="single">Single Name</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-2">
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
          </TabsContent>

          <TabsContent value="bulk" className="space-y-2">
            <Textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              onKeyPress={handleBulkKeyPress}
              placeholder="Enter names separated by commas or new lines...&#10;Example:&#10;Alice, Bob, Charlie&#10;David&#10;Eve"
              className="min-h-20"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Ctrl+Enter to add
              </span>
              <Button onClick={addBulkNames} disabled={!bulkInput.trim()}>
                <Users className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Names Pool */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3>Names Pool ({names.length})</h3>
            <div className="flex gap-2">
              {allDrawn && (
                <Button
                  onClick={resetToOriginalGroup}
                  variant="default"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              )}
              {(names.length > 0 || originalGroup.length > 0) && (
                <Button onClick={clearAll} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
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
          ) : originalGroup.length > 0 ? (
            <div className="text-center p-4 bg-muted rounded-lg text-muted-foreground">
              All names drawn! Click Reset to start over.
            </div>
          ) : (
            <div className="text-center p-4 bg-muted rounded-lg text-muted-foreground">
              No names added yet
            </div>
          )}
        </div>

        {/* Original Group Display (when all names are drawn) */}
        {allDrawn && (
          <div>
            <h4 className="text-sm text-muted-foreground mb-2">
              Original Group ({originalGroup.length}):
            </h4>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-secondary/50 rounded-lg">
              {originalGroup.map((name, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Draw Button */}
        <Button
          onClick={drawName}
          disabled={names.length === 0 || isDrawing}
          className="w-full"
          size="lg"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isDrawing ? "Drawing..." : "Draw Name"}
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
                <p className="text-3xl text-primary animate-pulse">
                  {drawnName}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Messages */}
        {allDrawn && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-2">
              🎉 All names have been drawn!
            </p>
            <p className="text-sm text-muted-foreground">
              Use the Reset button to start a new round with the same group.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
