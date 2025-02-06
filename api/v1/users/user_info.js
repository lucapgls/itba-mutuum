import { supabase } from '../../supabase_config.js';

export const getUserInfo = async (user_id) => {
    console.log(user_id);
    

    const {data, error } = await supabase
    .from('users_info')
    .select('*')
    .eq('id', user_id);
    
    console.log(data);

    if (error) {
        throw new Error('Error fetching user info');
    }

    return data;
};

export const setEmail = async (user_id, email) => {
    const { data, error } = await supabase
    .from('users_info')
    .upsert([{
        id: user_id,
        email: email
    }])
    .select();
    
    if (error) {
        throw new Error('Error setting email');
    }
    return data;
};


export const setDisplayName = async (user_id, display_name) => {
    const { data, error } = await supabase
    .from('users_info')
    .upsert([{
        id: user_id,
        display_name: display_name
    }])
    .select();

    if (error) {
        throw new Error('Error setting display name');
    }
    return data;
}

export const setDni = async (user_id, dni) => {
    const { data, error } = await supabase
    .from('users_info')
    .upsert([{
        id: user_id,
        dni: dni
    }])
    .select();

    if (error) {
        throw new Error('Error setting dni');
    }
    return data;
}

export const setPhoneNumber = async (user_id, phone_number) => {
    const { data, error } = await supabase
    .from('users_info')
    .upsert([{
        id: user_id,
        phone: phone_number
    }])
    .select();

    if (error) {
        throw new Error('Error setting phone number');
    }
    return data;
}

export const setProfilePicture = async (user_id, profile_picture) => {
    const { data, error } = await supabase
    .upsert('users_info', [{
        id: user_id,
        profile_picture: profile_picture
    }])
    .select();

    if (error) {
        throw new Error('Error setting profile picture');
    }
    return data;
};



