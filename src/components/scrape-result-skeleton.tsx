import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tags, Heading1, Type, LinkIcon, ImageIcon, TableIcon, FileJson } from "lucide-react";

const DataSectionSkeleton: React.FC<{ title: string; icon: React.ElementType; }> = ({ title, icon: Icon }) => (
  <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-2 text-primary/50" />
        <Skeleton className="h-6 w-32" />
      </div>
    </AccordionTrigger>
    <AccordionContent>
        <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    </AccordionContent>
  </AccordionItem>
);


export function ScrapeResultSkeleton() {
  return (
    <div className="animate-fade-in">
        <Card className="w-full shadow-lg mt-8 pointer-events-none">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-wrap gap-2 pt-2">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-6 w-40 rounded-full" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                    <Skeleton className="h-6 w-32 mb-3" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>

                <Accordion type="multiple" className="w-full" defaultValue={['meta-information']}>
                    <DataSectionSkeleton title="Meta Information" icon={Tags} />
                    <DataSectionSkeleton title="Headings" icon={Heading1} />
                    <DataSectionSkeleton title="Paragraphs" icon={Type} />
                    <DataSectionSkeleton title="Links" icon={LinkIcon} />
                    <DataSectionSkeleton title="Images" icon={ImageIcon} />
                    <DataSectionSkeleton title="Tables" icon={TableIcon} />
                    <DataSectionSkeleton title="JSON-LD" icon={FileJson} />
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}
