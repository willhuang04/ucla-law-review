import { supabase } from '../../lib/supabase';

export function SupabaseTest() {
  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Test 1: Check if we can connect
      const { data, error } = await supabase.from('submissions').select('count');
      
      if (error) {
        console.error('Supabase connection error:', error);
        return;
      }
      
      console.log('✅ Supabase connected successfully!');
      console.log('Current submissions count:', data);
      
      // Test 2: Try inserting a test submission
      const { data: insertData, error: insertError } = await supabase
        .from('submissions')
        .insert({
          title: 'Test Submission',
          abstract: 'This is a test abstract',
          author_name: 'Test Author',
          author_email: 'test@example.com',
          category: 'Test'
        })
        .select();
      
      if (insertError) {
        console.error('Insert error:', insertError);
        return;
      }
      
      console.log('✅ Test submission created:', insertData);
      
      // Clean up - delete the test submission
      if (insertData && insertData[0]) {
        await supabase.from('submissions').delete().eq('id', insertData[0].id);
        console.log('✅ Test submission cleaned up');
      }
      
    } catch (err) {
      console.error('Connection test failed:', err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Supabase Connection Test</h3>
      <button 
        onClick={testConnection}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Connection
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Check browser console for results
      </p>
    </div>
  );
}