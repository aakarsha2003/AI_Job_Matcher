import { useFilterContext } from "@/context/FilterContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter, RotateCcw } from "lucide-react";

export function FilterSidebar({ className }: { className?: string }) {
  const { filters, setFilters, resetFilters, updateFilter } = useFilterContext();

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <Filter size={18} />
          Filters
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters} 
          className="text-xs h-8 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw size={12} className="mr-1.5" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Keywords</Label>
          <Input 
            placeholder="Title, Company..." 
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <Input 
            placeholder="City, State, Zip" 
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select 
            value={filters.type} 
            onValueChange={(val) => updateFilter("type", val === "all" ? "" : val)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Work Mode</Label>
          <Select 
            value={filters.workMode} 
            onValueChange={(val) => updateFilter("workMode", val === "all" ? "" : val)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="All Modes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="On-site">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label>Min Match Score</Label>
            <span className="text-sm font-medium text-primary">
              {filters.minMatchScore}%
            </span>
          </div>
          <Slider
            value={[filters.minMatchScore]}
            onValueChange={(vals) => updateFilter("minMatchScore", vals[0])}
            max={100}
            step={5}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Filter jobs based on how well they match your resume.
          </p>
        </div>
      </div>
    </div>
  );
}
