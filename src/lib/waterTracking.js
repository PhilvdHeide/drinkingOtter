import { supabase, supabaseService } from './supabaseClient';

export const logWaterConsumption = async ({ amount_ml, drink_type }) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // For removing drinks, use the removeLastDrink function instead
  if (!drink_type) {
    const { data: lastDrink } = await supabase
      .from('water_logs')
      .select('id')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: false })
      .limit(1)
      .single();

    if (!lastDrink) {
      throw new Error('No drinks to remove');
    }

    const { error: deleteError } = await supabase
      .from('water_logs')
      .delete()
      .eq('id', lastDrink.id);

    if (deleteError) throw deleteError;
    return { data: lastDrink };
  }

  const { data, error } = await supabaseService
    .from('water_logs')
    .insert([
      {
        user_id: user.id,
        amount_ml: amount_ml,
        drink_type: drink_type || 'water'  // Default to water if not specified
      }
    ])
    .select('amount_ml, drink_type, logged_at');

  if (error) throw error;
  return { data, error };
};

export const removeLastDrink = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get the last drink
  const { data: lastDrink, error: findError } = await supabase
    .from('water_logs')
    .select('id')
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .limit(1)
    .single();

  if (findError) throw findError;

  // Delete the last drink
  const { error: deleteError } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', lastDrink.id);

  if (deleteError) throw deleteError;
  return lastDrink;
};

export const getTodayWaterConsumption = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const { data, error } = await supabase
    .from('water_logs')
    .select('amount_ml, drink_type, logged_at')
    .eq('user_id', user.id)
    .gte('logged_at', startOfDay)
    .lte('logged_at', endOfDay)
    .order('logged_at', { ascending: true });

  if (error) throw error;
  
    return {
      total: data.reduce((total, log) => total + log.amount_ml, 0),
      drinks: data.map(log => ({
        id: log.id,
        amount_ml: log.amount_ml,
        drink_type: log.drink_type || 'water',
        logged_at: log.logged_at
      }))
    };
};

export const debugWaterLogs = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  
  console.log('Recent water logs:');
  console.table(data);
  return data;
};
