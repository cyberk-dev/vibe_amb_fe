import { ConfirmDialogExamplesContainer } from './_components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Code, Zap } from 'lucide-react';

const GlobalDialogPage = () => {
  const features = [
    'Global Zustand store for dialog state management',
    'Promise-based API with async mutation support',
    'Loading states with spinner indicators',
    'Customizable dialog appearance and text',
    'Destructive action styling with warning icons',
    'Multi-step workflows with progress tracking',
    'Error handling and retry mechanisms',
    'TypeScript support with strict typing'
  ];

  const codeExample = `import { useConfirmDialog } from '@/lib/hooks/use-confirm-dialog';
import { deleteItemMutation } from '@/lib/mocks/async-mutations';

const MyComponent = () => {
  const { showConfirm, setLoading } = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      title: 'Delete Item',
      description: 'This action cannot be undone.',
      variant: 'destructive'
    });

    if (confirmed) {
      setLoading(true);
      try {
        const result = await deleteItemMutation(itemId);
        if (result.success) {
          // Handle successful deletion
        } else {
          // Handle error
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return <Button onClick={handleDelete}>Delete</Button>;
};`;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-xs">
            Demo
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Global Confirm Dialog</h1>
          <p className="text-muted-foreground text-lg">
            Zustand-powered global confirmation dialogs with async mutations, loading states, and error handling
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Interactive Examples
                </CardTitle>
                <CardDescription>
                  Try different dialog configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfirmDialogExamplesContainer />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" />
                  Usage Example
                </CardTitle>
                <CardDescription>
                  Basic implementation pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
                <CardDescription>
                  Built with modern React patterns
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalDialogPage;