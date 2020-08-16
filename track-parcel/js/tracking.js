var app = new Vue({
    el: '#app',
    data: {
        trackingNumber: '',
        apiUrl: '',
        error: '',
        website_name: '',
        domain_name: '',
        shipment: [],
        status: '',
        locations: [],
        // count: 5
    },
    methods: {
        submitForm: function () {
            if(this.validateTrackingNumber()) {
                this.processTrackingNumber()
            }else {
                document.getElementById('error').className = 'block text-red-700 mb-6 tracking-widest'
                document.getElementById('error').innerHTML = 'Tracking number required';
            }
        },
        validateTrackingNumber: function () {
            if(this.trackingNumber) return true
        },
        processTrackingNumber: function () {
            document.getElementById('loading').className = 'block tracking-widest text-green-700 mb-6';
            document.getElementById('error').className = 'hidden';

            this.apiUrl = 'https://route.cloudispatcher.com/api/shipments/tracking/' + this.trackingNumber;

            console.log(this.apiUrl);

            var self = this

            axios.get(this.apiUrl)
            .then(function (response) {

                setTimeout( function () {
                    document.getElementById('loading').className = 'hidden';

                    if(!response.data.data.success) {
                        this.error = response.data.data.message
                        document.getElementById('error').className = 'block text-red-700 mb-6 tracking-widest'
                        document.getElementById('error').innerHTML = this.error
                    } 
                    
                    if (response.data.data.success) {


                        console.log(response.data.data.website_name)
                        
                        self.website_name = response.data.data.website_name
                        self.domain_name = response.data.data.website_domain
                        self.shipment = response.data.data.shipment_details
                        self.locations = response.data.data.shipment_routes
                        self.status = response.data.data.status

                        document.getElementById('error').className = 'hidden'
                    
                        // var intt = setInterval(() => {
                        //     if(self.count != 0) {
                        //         self.count -= 1
                        //     }
                        // }, 1000);
                    
                        document.getElementById('error').className = 'block text-green-700 mb-6 tracking-widest'
                        document.getElementById('error').innerHTML = 'Tracking successful. You are been redirected'

                        setTimeout( function () {
                            
                            document.getElementById('login-form').className = 'hidden'
                            
                            document.getElementById('result-container').className = 'block'
                        
                        }, 5000);
                    }
                }, 3000)
            })
            .catch(function (error) {
                console.log(error)
            })
            .then(function () {
              // always executed
            })
        }
    },
    filters: {
        humanReadableDay: function (value) {
            if (!value) return ''
            // var days = [];
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            var day = new Date(value);
            return days[day.getDay()];
        },
        humanReadableDate: function(value) {
            if (!value) return ''
            var day = new Date(value);
            return day.toDateString();
        }
    }
});
