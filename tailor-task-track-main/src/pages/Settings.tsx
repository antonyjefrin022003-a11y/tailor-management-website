
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useSimpleOrganization } from '@/contexts/SimpleOrganizationContext';

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name is required'),
});

const Settings = () => {
  const { currentOrganization, setCurrentOrganization } = useSimpleOrganization();
  const [isEditing, setIsEditing] = useState(false);

  const organizationForm = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: currentOrganization?.name || 'Tailor Task',
    },
  });

  React.useEffect(() => {
    if (currentOrganization) {
      organizationForm.reset({
        name: currentOrganization.name,
      });
    }
  }, [currentOrganization, organizationForm]);

  const handleUpdateOrganization = async (data: z.infer<typeof organizationSchema>) => {
    if (!currentOrganization) return;
    
    try {
      setCurrentOrganization({
        ...currentOrganization,
        name: data.name
      });
      setIsEditing(false);
      toast.success('Organization updated successfully');
    } catch (error) {
      console.error('Failed to update organization:', error);
      toast.error('Failed to update organization');
    }
  };

  if (!currentOrganization) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-lg font-semibold">No organization selected</h2>
        <p className="text-gray-500">Please create or select an organization to view settings</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="organization">
        <TabsList className="mb-4">
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...organizationForm}>
                  <form onSubmit={organizationForm.handleSubmit(handleUpdateOrganization)} className="space-y-4">
                    <FormField
                      control={organizationForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={organizationForm.formState.isSubmitting}
                      >
                        {organizationForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          organizationForm.reset({ name: currentOrganization?.name || '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Organization Name</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{currentOrganization.name}</span>
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid gap-2">
                    <Label>Organization ID</Label>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">{currentOrganization.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
