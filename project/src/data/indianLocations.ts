// Comprehensive Indian locations database for better search coverage
export interface IndianLocation {
  name: string;
  city: string;
  state: string;
  coordinates: [number, number];
  type: 'city' | 'locality' | 'colony' | 'area' | 'district' | 'suburb';
  aliases?: string[];
}

// Major Indian cities with comprehensive locality coverage
export const indianLocations: IndianLocation[] = [
  // Delhi NCR - Comprehensive coverage
  { name: 'Connaught Place', city: 'Delhi', state: 'Delhi', coordinates: [28.6315, 77.2167], type: 'area' },
  { name: 'Karol Bagh', city: 'Delhi', state: 'Delhi', coordinates: [28.6519, 77.1909], type: 'area' },
  { name: 'Lajpat Nagar', city: 'Delhi', state: 'Delhi', coordinates: [28.5677, 77.2436], type: 'area' },
  { name: 'Saket', city: 'Delhi', state: 'Delhi', coordinates: [28.5245, 77.2066], type: 'area' },
  { name: 'Vasant Kunj', city: 'Delhi', state: 'Delhi', coordinates: [28.5200, 77.1591], type: 'area' },
  { name: 'Dwarka', city: 'Delhi', state: 'Delhi', coordinates: [28.5921, 77.0460], type: 'area' },
  { name: 'Rohini', city: 'Delhi', state: 'Delhi', coordinates: [28.7041, 77.1025], type: 'area' },
  { name: 'Janakpuri', city: 'Delhi', state: 'Delhi', coordinates: [28.6219, 77.0814], type: 'area' },
  { name: 'Pitampura', city: 'Delhi', state: 'Delhi', coordinates: [28.6942, 77.1314], type: 'area' },
  { name: 'Mayur Vihar', city: 'Delhi', state: 'Delhi', coordinates: [28.6127, 77.2773], type: 'area' },
  { name: 'Preet Vihar', city: 'Delhi', state: 'Delhi', coordinates: [28.6127, 77.2773], type: 'area' },
  { name: 'Laxmi Nagar', city: 'Delhi', state: 'Delhi', coordinates: [28.6345, 77.2771], type: 'area' },
  { name: 'Rajouri Garden', city: 'Delhi', state: 'Delhi', coordinates: [28.6469, 77.1200], type: 'area' },
  { name: 'Tilak Nagar', city: 'Delhi', state: 'Delhi', coordinates: [28.6414, 77.0917], type: 'area' },
  { name: 'Punjabi Bagh', city: 'Delhi', state: 'Delhi', coordinates: [28.6742, 77.1347], type: 'area' },
  { name: 'Paschim Vihar', city: 'Delhi', state: 'Delhi', coordinates: [28.6692, 77.1056], type: 'area' },
  { name: 'Anand Vihar', city: 'Delhi', state: 'Delhi', coordinates: [28.6469, 77.3152], type: 'area' },
  { name: 'Shahdara', city: 'Delhi', state: 'Delhi', coordinates: [28.6692, 77.2889], type: 'area' },
  { name: 'Dilshad Garden', city: 'Delhi', state: 'Delhi', coordinates: [28.6892, 77.3181], type: 'area' },
  { name: 'Vivek Vihar', city: 'Delhi', state: 'Delhi', coordinates: [28.6725, 77.3181], type: 'area' },

  // Gurgaon/Gurugram
  { name: 'Cyber City', city: 'Gurgaon', state: 'Haryana', coordinates: [28.4947, 77.0869], type: 'area' },
  { name: 'Sector 14', city: 'Gurgaon', state: 'Haryana', coordinates: [28.4595, 77.0266], type: 'area' },
  { name: 'Sector 29', city: 'Gurgaon', state: 'Haryana', coordinates: [28.4601, 77.0648], type: 'area' },
  { name: 'MG Road', city: 'Gurgaon', state: 'Haryana', coordinates: [28.4601, 77.0648], type: 'area' },
  { name: 'Golf Course Road', city: 'Gurgaon', state: 'Haryana', coordinates: [28.4421, 77.0502], type: 'area' },
  { name: 'Sohna Road', city: 'Gurgaon', state: 'Haryana', coordinates: [28.3670, 77.0820], type: 'area' },

  // Noida
  { name: 'Sector 18', city: 'Noida', state: 'Uttar Pradesh', coordinates: [28.5678, 77.3261], type: 'area' },
  { name: 'Sector 62', city: 'Noida', state: 'Uttar Pradesh', coordinates: [28.6139, 77.3648], type: 'area' },
  { name: 'Greater Noida', city: 'Greater Noida', state: 'Uttar Pradesh', coordinates: [28.4744, 77.5040], type: 'city' },

  // Mumbai - Comprehensive coverage
  { name: 'Bandra', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0596, 72.8295], type: 'area' },
  { name: 'Andheri', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.1136, 72.8697], type: 'area' },
  { name: 'Juhu', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.1075, 72.8263], type: 'area' },
  { name: 'Powai', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.1197, 72.9056], type: 'area' },
  { name: 'Worli', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0176, 72.8118], type: 'area' },
  { name: 'Colaba', city: 'Mumbai', state: 'Maharashtra', coordinates: [18.9067, 72.8147], type: 'area' },
  { name: 'Fort', city: 'Mumbai', state: 'Maharashtra', coordinates: [18.9338, 72.8356], type: 'area' },
  { name: 'Dadar', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0176, 72.8562], type: 'area' },
  { name: 'Kurla', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0728, 72.8826], type: 'area' },
  { name: 'Malad', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.1864, 72.8493], type: 'area' },
  { name: 'Borivali', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.2307, 72.8567], type: 'area' },
  { name: 'Kandivali', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.2043, 72.8527], type: 'area' },
  { name: 'Goregaon', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.1663, 72.8526], type: 'area' },
  { name: 'Versova', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.1317, 72.8138], type: 'area' },
  { name: 'Lokhandwala', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.1368, 72.8261], type: 'area' },
  { name: 'Santacruz', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0896, 72.8656], type: 'area' },
  { name: 'Vile Parle', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0990, 72.8470], type: 'area' },
  { name: 'Khar', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0728, 72.8370], type: 'area' },
  { name: 'Linking Road', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0544, 72.8301], type: 'area' },

  // Bangalore - Comprehensive coverage
  { name: 'Koramangala', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9279, 77.6271], type: 'area' },
  { name: 'Indiranagar', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9719, 77.6412], type: 'area' },
  { name: 'Whitefield', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9698, 77.7500], type: 'area' },
  { name: 'Electronic City', city: 'Bangalore', state: 'Karnataka', coordinates: [12.8456, 77.6603], type: 'area' },
  { name: 'BTM Layout', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9165, 77.6101], type: 'area' },
  { name: 'Jayanagar', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9237, 77.5937], type: 'area' },
  { name: 'JP Nagar', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9081, 77.5831], type: 'area' },
  { name: 'HSR Layout', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9116, 77.6473], type: 'area' },
  { name: 'Marathahalli', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9591, 77.6974], type: 'area' },
  { name: 'Sarjapur Road', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9010, 77.6874], type: 'area' },
  { name: 'Bannerghatta Road', city: 'Bangalore', state: 'Karnataka', coordinates: [12.8456, 77.6603], type: 'area' },
  { name: 'Hebbal', city: 'Bangalore', state: 'Karnataka', coordinates: [13.0358, 77.5970], type: 'area' },
  { name: 'Yeshwantpur', city: 'Bangalore', state: 'Karnataka', coordinates: [13.0284, 77.5546], type: 'area' },
  { name: 'Rajajinagar', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9991, 77.5554], type: 'area' },
  { name: 'Malleshwaram', city: 'Bangalore', state: 'Karnataka', coordinates: [13.0031, 77.5727], type: 'area' },
  { name: 'Basavanagudi', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9395, 77.5731], type: 'area' },

  // Chennai - Comprehensive coverage
  { name: 'T Nagar', city: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0418, 80.2341], type: 'area' },
  { name: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0850, 80.2101], type: 'area' },
  { name: 'Adyar', city: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0067, 80.2206], type: 'area' },
  { name: 'Velachery', city: 'Chennai', state: 'Tamil Nadu', coordinates: [12.9750, 80.2200], type: 'area' },
  { name: 'OMR', city: 'Chennai', state: 'Tamil Nadu', coordinates: [12.8406, 80.2270], type: 'area', aliases: ['Old Mahabalipuram Road'] },
  { name: 'Tambaram', city: 'Chennai', state: 'Tamil Nadu', coordinates: [12.9249, 80.1000], type: 'area' },
  { name: 'Porur', city: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0381, 80.1564], type: 'area' },
  { name: 'Chrompet', city: 'Chennai', state: 'Tamil Nadu', coordinates: [12.9516, 80.1462], type: 'area' },

  // Hyderabad - Comprehensive coverage
  { name: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', coordinates: [17.4126, 78.4482], type: 'area' },
  { name: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', coordinates: [17.4239, 78.4738], type: 'area' },
  { name: 'HITEC City', city: 'Hyderabad', state: 'Telangana', coordinates: [17.4435, 78.3772], type: 'area' },
  { name: 'Gachibowli', city: 'Hyderabad', state: 'Telangana', coordinates: [17.4399, 78.3487], type: 'area' },
  { name: 'Kondapur', city: 'Hyderabad', state: 'Telangana', coordinates: [17.4616, 78.3622], type: 'area' },
  { name: 'Madhapur', city: 'Hyderabad', state: 'Telangana', coordinates: [17.4483, 78.3915], type: 'area' },
  { name: 'Secunderabad', city: 'Hyderabad', state: 'Telangana', coordinates: [17.5040, 78.5030], type: 'area' },
  { name: 'Begumpet', city: 'Hyderabad', state: 'Telangana', coordinates: [17.4399, 78.4482], type: 'area' },

  // Pune - Comprehensive coverage
  { name: 'Koregaon Park', city: 'Pune', state: 'Maharashtra', coordinates: [18.5362, 73.8958], type: 'area' },
  { name: 'Baner', city: 'Pune', state: 'Maharashtra', coordinates: [18.5679, 73.7797], type: 'area' },
  { name: 'Wakad', city: 'Pune', state: 'Maharashtra', coordinates: [18.5975, 73.7898], type: 'area' },
  { name: 'Hinjewadi', city: 'Pune', state: 'Maharashtra', coordinates: [18.5912, 73.7389], type: 'area' },
  { name: 'Kothrud', city: 'Pune', state: 'Maharashtra', coordinates: [18.5074, 73.8077], type: 'area' },
  { name: 'Aundh', city: 'Pune', state: 'Maharashtra', coordinates: [18.5593, 73.8078], type: 'area' },
  { name: 'Viman Nagar', city: 'Pune', state: 'Maharashtra', coordinates: [18.5679, 73.9143], type: 'area' },
  { name: 'Hadapsar', city: 'Pune', state: 'Maharashtra', coordinates: [18.5089, 73.9260], type: 'area' },

  // Kolkata - Comprehensive coverage
  { name: 'Salt Lake', city: 'Kolkata', state: 'West Bengal', coordinates: [22.5958, 88.4497], type: 'area' },
  { name: 'Park Street', city: 'Kolkata', state: 'West Bengal', coordinates: [22.5448, 88.3426], type: 'area' },
  { name: 'Ballygunge', city: 'Kolkata', state: 'West Bengal', coordinates: [22.5354, 88.3643], type: 'area' },
  { name: 'Howrah', city: 'Kolkata', state: 'West Bengal', coordinates: [22.5958, 88.2636], type: 'area' },
  { name: 'New Town', city: 'Kolkata', state: 'West Bengal', coordinates: [22.5958, 88.4497], type: 'area' },

  // Ahmedabad - Comprehensive coverage
  { name: 'Satellite', city: 'Ahmedabad', state: 'Gujarat', coordinates: [23.0267, 72.5090], type: 'area' },
  { name: 'Vastrapur', city: 'Ahmedabad', state: 'Gujarat', coordinates: [23.0395, 72.5240], type: 'area' },
  { name: 'Bopal', city: 'Ahmedabad', state: 'Gujarat', coordinates: [23.0395, 72.4240], type: 'area' },
  { name: 'Prahlad Nagar', city: 'Ahmedabad', state: 'Gujarat', coordinates: [23.0267, 72.5090], type: 'area' },

  // Jaipur - Comprehensive coverage
  { name: 'Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', coordinates: [26.8854, 75.8144], type: 'area' },
  { name: 'Vaishali Nagar', city: 'Jaipur', state: 'Rajasthan', coordinates: [26.9354, 75.7272], type: 'area' },
  { name: 'C Scheme', city: 'Jaipur', state: 'Rajasthan', coordinates: [26.9124, 75.7873], type: 'area' },
  { name: 'Mansarovar', city: 'Jaipur', state: 'Rajasthan', coordinates: [26.8854, 75.7647], type: 'area' },

  // Major cities
  { name: 'Delhi', city: 'Delhi', state: 'Delhi', coordinates: [28.6139, 77.2090], type: 'city' },
  { name: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', coordinates: [19.0760, 72.8777], type: 'city' },
  { name: 'Bangalore', city: 'Bangalore', state: 'Karnataka', coordinates: [12.9716, 77.5946], type: 'city', aliases: ['Bengaluru'] },
  { name: 'Chennai', city: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0827, 80.2707], type: 'city' },
  { name: 'Kolkata', city: 'Kolkata', state: 'West Bengal', coordinates: [22.5726, 88.3639], type: 'city' },
  { name: 'Hyderabad', city: 'Hyderabad', state: 'Telangana', coordinates: [17.3850, 78.4867], type: 'city' },
  { name: 'Pune', city: 'Pune', state: 'Maharashtra', coordinates: [18.5204, 73.8567], type: 'city' },
  { name: 'Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', coordinates: [23.0225, 72.5714], type: 'city' },
  { name: 'Jaipur', city: 'Jaipur', state: 'Rajasthan', coordinates: [26.9124, 75.7873], type: 'city' },
  { name: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', coordinates: [26.8467, 80.9462], type: 'city' },
  { name: 'Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', coordinates: [26.4499, 80.3319], type: 'city' },
  { name: 'Nagpur', city: 'Nagpur', state: 'Maharashtra', coordinates: [21.1458, 79.0882], type: 'city' },
  { name: 'Indore', city: 'Indore', state: 'Madhya Pradesh', coordinates: [22.7196, 75.8577], type: 'city' },
  { name: 'Thane', city: 'Thane', state: 'Maharashtra', coordinates: [19.2183, 72.9781], type: 'city' },
  { name: 'Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', coordinates: [23.2599, 77.4126], type: 'city' },
  { name: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', coordinates: [17.6868, 83.2185], type: 'city' },
  { name: 'Patna', city: 'Patna', state: 'Bihar', coordinates: [25.5941, 85.1376], type: 'city' },
  { name: 'Vadodara', city: 'Vadodara', state: 'Gujarat', coordinates: [22.3072, 73.1812], type: 'city' },
  { name: 'Ghaziabad', city: 'Ghaziabad', state: 'Uttar Pradesh', coordinates: [28.6692, 77.4538], type: 'city' },
  { name: 'Ludhiana', city: 'Ludhiana', state: 'Punjab', coordinates: [30.9010, 75.8573], type: 'city' },
  { name: 'Agra', city: 'Agra', state: 'Uttar Pradesh', coordinates: [27.1767, 78.0081], type: 'city' },
  { name: 'Nashik', city: 'Nashik', state: 'Maharashtra', coordinates: [19.9975, 73.7898], type: 'city' },
  { name: 'Faridabad', city: 'Faridabad', state: 'Haryana', coordinates: [28.4089, 77.3178], type: 'city' },
  { name: 'Meerut', city: 'Meerut', state: 'Uttar Pradesh', coordinates: [28.9845, 77.7064], type: 'city' },
  { name: 'Rajkot', city: 'Rajkot', state: 'Gujarat', coordinates: [22.3039, 70.8022], type: 'city' },
  { name: 'Kalyan-Dombivli', city: 'Kalyan', state: 'Maharashtra', coordinates: [19.2403, 73.1305], type: 'city' },
  { name: 'Vasai-Virar', city: 'Vasai', state: 'Maharashtra', coordinates: [19.4912, 72.8054], type: 'city' },
  { name: 'Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', coordinates: [25.3176, 82.9739], type: 'city' },
  { name: 'Srinagar', city: 'Srinagar', state: 'Jammu and Kashmir', coordinates: [34.0837, 74.7973], type: 'city' },
  { name: 'Aurangabad', city: 'Aurangabad', state: 'Maharashtra', coordinates: [19.8762, 75.3433], type: 'city' },
  { name: 'Dhanbad', city: 'Dhanbad', state: 'Jharkhand', coordinates: [23.7957, 86.4304], type: 'city' },
  { name: 'Amritsar', city: 'Amritsar', state: 'Punjab', coordinates: [31.6340, 74.8723], type: 'city' },
  { name: 'Navi Mumbai', city: 'Navi Mumbai', state: 'Maharashtra', coordinates: [19.0330, 73.0297], type: 'city' },
  { name: 'Allahabad', city: 'Allahabad', state: 'Uttar Pradesh', coordinates: [25.4358, 81.8463], type: 'city', aliases: ['Prayagraj'] },
  { name: 'Ranchi', city: 'Ranchi', state: 'Jharkhand', coordinates: [23.3441, 85.3096], type: 'city' },
  { name: 'Howrah', city: 'Howrah', state: 'West Bengal', coordinates: [22.5958, 88.2636], type: 'city' },
  { name: 'Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu', coordinates: [11.0168, 76.9558], type: 'city' },
  { name: 'Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', coordinates: [23.1815, 79.9864], type: 'city' },
  { name: 'Gwalior', city: 'Gwalior', state: 'Madhya Pradesh', coordinates: [26.2183, 78.1828], type: 'city' },
  { name: 'Vijayawada', city: 'Vijayawada', state: 'Andhra Pradesh', coordinates: [16.5062, 80.6480], type: 'city' },
  { name: 'Jodhpur', city: 'Jodhpur', state: 'Rajasthan', coordinates: [26.2389, 73.0243], type: 'city' },
  { name: 'Madurai', city: 'Madurai', state: 'Tamil Nadu', coordinates: [9.9252, 78.1198], type: 'city' },
  { name: 'Raipur', city: 'Raipur', state: 'Chhattisgarh', coordinates: [21.2514, 81.6296], type: 'city' },
  { name: 'Kota', city: 'Kota', state: 'Rajasthan', coordinates: [25.2138, 75.8648], type: 'city' },
  { name: 'Guwahati', city: 'Guwahati', state: 'Assam', coordinates: [26.1445, 91.7362], type: 'city' },
  { name: 'Chandigarh', city: 'Chandigarh', state: 'Chandigarh', coordinates: [30.7333, 76.7794], type: 'city' },
  { name: 'Thiruvananthapuram', city: 'Thiruvananthapuram', state: 'Kerala', coordinates: [8.5241, 76.9366], type: 'city' },
  { name: 'Solapur', city: 'Solapur', state: 'Maharashtra', coordinates: [17.6599, 75.9064], type: 'city' },
  { name: 'Hubballi-Dharwad', city: 'Hubballi', state: 'Karnataka', coordinates: [15.3647, 75.1240], type: 'city' },
  { name: 'Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu', coordinates: [10.7905, 78.7047], type: 'city' },
  { name: 'Bareilly', city: 'Bareilly', state: 'Uttar Pradesh', coordinates: [28.3670, 79.4304], type: 'city' },
  { name: 'Mysore', city: 'Mysore', state: 'Karnataka', coordinates: [12.2958, 76.6394], type: 'city', aliases: ['Mysuru'] },
  { name: 'Tiruppur', city: 'Tiruppur', state: 'Tamil Nadu', coordinates: [11.1085, 77.3411], type: 'city' },
  { name: 'Gurgaon', city: 'Gurgaon', state: 'Haryana', coordinates: [28.4595, 77.0266], type: 'city', aliases: ['Gurugram'] },
  { name: 'Aligarh', city: 'Aligarh', state: 'Uttar Pradesh', coordinates: [27.8974, 78.0880], type: 'city' },
  { name: 'Jalandhar', city: 'Jalandhar', state: 'Punjab', coordinates: [31.3260, 75.5762], type: 'city' },
  { name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', coordinates: [20.2961, 85.8245], type: 'city' },
  { name: 'Salem', city: 'Salem', state: 'Tamil Nadu', coordinates: [11.6643, 78.1460], type: 'city' },
  { name: 'Mira-Bhayandar', city: 'Mira-Bhayandar', state: 'Maharashtra', coordinates: [19.2952, 72.8544], type: 'city' },
  { name: 'Warangal', city: 'Warangal', state: 'Telangana', coordinates: [17.9689, 79.5941], type: 'city' },
  { name: 'Guntur', city: 'Guntur', state: 'Andhra Pradesh', coordinates: [16.3067, 80.4365], type: 'city' },
  { name: 'Bhiwandi', city: 'Bhiwandi', state: 'Maharashtra', coordinates: [19.3002, 73.0635], type: 'city' },
  { name: 'Saharanpur', city: 'Saharanpur', state: 'Uttar Pradesh', coordinates: [29.9680, 77.5552], type: 'city' },
  { name: 'Gorakhpur', city: 'Gorakhpur', state: 'Uttar Pradesh', coordinates: [26.7606, 83.3732], type: 'city' },
  { name: 'Bikaner', city: 'Bikaner', state: 'Rajasthan', coordinates: [28.0229, 73.3119], type: 'city' },
  { name: 'Amravati', city: 'Amravati', state: 'Maharashtra', coordinates: [20.9374, 77.7796], type: 'city' },
  { name: 'Noida', city: 'Noida', state: 'Uttar Pradesh', coordinates: [28.5355, 77.3910], type: 'city' },
  { name: 'Jamshedpur', city: 'Jamshedpur', state: 'Jharkhand', coordinates: [22.8046, 86.2029], type: 'city' },
  { name: 'Bhilai Nagar', city: 'Bhilai', state: 'Chhattisgarh', coordinates: [21.1938, 81.3509], type: 'city' },
  { name: 'Cuttack', city: 'Cuttack', state: 'Odisha', coordinates: [20.4625, 85.8828], type: 'city' },
  { name: 'Firozabad', city: 'Firozabad', state: 'Uttar Pradesh', coordinates: [27.1592, 78.3957], type: 'city' },
  { name: 'Kochi', city: 'Kochi', state: 'Kerala', coordinates: [9.9312, 76.2673], type: 'city' },
  { name: 'Nellore', city: 'Nellore', state: 'Andhra Pradesh', coordinates: [14.4426, 79.9865], type: 'city' },
  { name: 'Bhavnagar', city: 'Bhavnagar', state: 'Gujarat', coordinates: [21.7645, 72.1519], type: 'city' },
  { name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand', coordinates: [30.3165, 78.0322], type: 'city' },
  { name: 'Durgapur', city: 'Durgapur', state: 'West Bengal', coordinates: [23.5204, 87.3119], type: 'city' },
  { name: 'Asansol', city: 'Asansol', state: 'West Bengal', coordinates: [23.6739, 86.9524], type: 'city' },
  { name: 'Rourkela', city: 'Rourkela', state: 'Odisha', coordinates: [22.2604, 84.8536], type: 'city' },
  { name: 'Nanded', city: 'Nanded', state: 'Maharashtra', coordinates: [19.1383, 77.2975], type: 'city' },
  { name: 'Kolhapur', city: 'Kolhapur', state: 'Maharashtra', coordinates: [16.7050, 74.2433], type: 'city' },
  { name: 'Ajmer', city: 'Ajmer', state: 'Rajasthan', coordinates: [26.4499, 74.6399], type: 'city' },
  { name: 'Akola', city: 'Akola', state: 'Maharashtra', coordinates: [20.7002, 77.0082], type: 'city' },
  { name: 'Gulbarga', city: 'Gulbarga', state: 'Karnataka', coordinates: [17.3297, 76.8343], type: 'city' },
  { name: 'Jamnagar', city: 'Jamnagar', state: 'Gujarat', coordinates: [22.4707, 70.0577], type: 'city' },
  { name: 'Ujjain', city: 'Ujjain', state: 'Madhya Pradesh', coordinates: [23.1765, 75.7885], type: 'city' },
  { name: 'Loni', city: 'Loni', state: 'Uttar Pradesh', coordinates: [28.7333, 77.2833], type: 'city' },
  { name: 'Siliguri', city: 'Siliguri', state: 'West Bengal', coordinates: [26.7271, 88.3953], type: 'city' },
  { name: 'Jhansi', city: 'Jhansi', state: 'Uttar Pradesh', coordinates: [25.4484, 78.5685], type: 'city' },
  { name: 'Ulhasnagar', city: 'Ulhasnagar', state: 'Maharashtra', coordinates: [19.2215, 73.1645], type: 'city' },
  { name: 'Jammu', city: 'Jammu', state: 'Jammu and Kashmir', coordinates: [32.7266, 74.8570], type: 'city' },
  { name: 'Sangli-Miraj & Kupwad', city: 'Sangli', state: 'Maharashtra', coordinates: [16.8524, 74.5815], type: 'city' },
  { name: 'Mangalore', city: 'Mangalore', state: 'Karnataka', coordinates: [12.9141, 74.8560], type: 'city' },
  { name: 'Erode', city: 'Erode', state: 'Tamil Nadu', coordinates: [11.3410, 77.7172], type: 'city' },
  { name: 'Belgaum', city: 'Belgaum', state: 'Karnataka', coordinates: [15.8497, 74.4977], type: 'city' },
  { name: 'Ambattur', city: 'Ambattur', state: 'Tamil Nadu', coordinates: [13.1143, 80.1548], type: 'city' },
  { name: 'Tirunelveli', city: 'Tirunelveli', state: 'Tamil Nadu', coordinates: [8.7139, 77.7567], type: 'city' },
  { name: 'Malegaon', city: 'Malegaon', state: 'Maharashtra', coordinates: [20.5579, 74.5287], type: 'city' },
  { name: 'Gaya', city: 'Gaya', state: 'Bihar', coordinates: [24.7914, 85.0002], type: 'city' },
  { name: 'Jalgaon', city: 'Jalgaon', state: 'Maharashtra', coordinates: [21.0077, 75.5626], type: 'city' },
  { name: 'Udaipur', city: 'Udaipur', state: 'Rajasthan', coordinates: [24.5854, 73.7125], type: 'city' },
  { name: 'Maheshtala', city: 'Maheshtala', state: 'West Bengal', coordinates: [22.5093, 88.2482], type: 'city' }
];

// Fast search function with fuzzy matching
export const searchIndianLocations = (query: string, limit: number = 10): IndianLocation[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  const results: { location: IndianLocation; score: number }[] = [];
  
  indianLocations.forEach(location => {
    let score = 0;
    
    // Exact match gets highest score
    if (location.name.toLowerCase() === searchTerm) {
      score = 100;
    }
    // Starts with search term
    else if (location.name.toLowerCase().startsWith(searchTerm)) {
      score = 90;
    }
    // Contains search term
    else if (location.name.toLowerCase().includes(searchTerm)) {
      score = 70;
    }
    // City name matches
    else if (location.city.toLowerCase().includes(searchTerm)) {
      score = 60;
    }
    // State name matches
    else if (location.state.toLowerCase().includes(searchTerm)) {
      score = 50;
    }
    // Check aliases
    else if (location.aliases?.some(alias => alias.toLowerCase().includes(searchTerm))) {
      score = 80;
    }
    
    // Boost score for cities vs areas
    if (location.type === 'city') score += 10;
    
    if (score > 0) {
      results.push({ location, score });
    }
  });
  
  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(result => result.location);
};

// Get popular cities for quick access
export const getPopularCities = (): IndianLocation[] => {
  return indianLocations.filter(location => 
    location.type === 'city' && 
    ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].includes(location.name)
  );
};

// Convert location to API format
export const convertLocationToAPIFormat = (location: IndianLocation) => {
  return {
    station: {
      name: `${location.name}, ${location.city}, ${location.state}`,
      geo: location.coordinates
    }
  };
};