import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";
import { JSX, useState } from "react";

interface StockSource {
  id: string;
  name: string | JSX.Element;
  url: string;
}

const stockSources: StockSource[] = [
  {
    id: "google-images",
    name: "Google Images",
    url: "https://www.google.com/search?site=imghp&as_rights=(cc_publicdomain%7Ccc_attribute%7Ccc_sharealike).-(cc_noncommercial%7Ccc_nonderived)&udm=2",
  },
];

const StockDrawer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState(stockSources[0].id);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const source = stockSources.find((s) => s.id === selectedSource);
    if (!source) return;

    // Construct search URL with query parameter
    // const searchUrl = `${source.url}?q=${encodeURIComponent(searchQuery.trim()).replace(/%20/g, "+")}`;
    const searchUrl = `https://www.google.com/search?site=imghp&q=${encodeURIComponent(searchQuery.trim()).replace(/%20/g, "+")}&as_rights=(cc_publicdomain%7Ccc_attribute%7Ccc_sharealike).-(cc_noncommercial%7Ccc_nonderived)&udm=2`;

    // Open in new tab
    window.open(searchUrl, "_blank");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input
            id="search-input"
            placeholder="Enter your search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
            <Search className="size-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <RadioGroup
          value={selectedSource}
          onValueChange={setSelectedSource}
          className="space-y-2"
        >
          {stockSources.map((source) => (
            <div key={source.id} className="flex items-center space-x-2">
              <RadioGroupItem value={source.id} id={source.id} />
              <Label
                htmlFor={source.id}
                className="text-sm cursor-pointer flex-1"
              >
                {source.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default StockDrawer;
