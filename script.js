const app = Vue.createApp({
	
    data() {
		
        return {
			
            days: [],
			
            months: [
                { text: 'January', value: 0 },
                { text: 'February', value: 1 },
                { text: 'March', value: 2 },
                { text: 'April', value: 3 },
                { text: 'May', value: 4 },
                { text: 'June', value: 5 },
                { text: 'July', value: 6 },
                { text: 'August', value: 7 },
                { text: 'September', value: 8 },
                { text: 'October', value: 9 },
                { text: 'November', value: 10 },
                { text: 'December', value: 11 },
            ],
            numberOfTheMonth: new Date().getMonth(),
            year: new Date().getFullYear(),
            debug: '',
            imageSrc: null,
            fieldWidth: '28mm',
			fieldHeight: '20mm',
            imgWidth: '200mm',
            imgHeight: 'auto',
			imgMargin: '5mm',
        };
		
    },
	
    methods: {
		
        handleFileUpload(event) {
			
            const file = event.target.files[0];
			
            if (file) {
				
                const reader = new FileReader();
				
                reader.onload = (e) => {
					
                    this.imageSrc = e.target.result;
                    this.fieldWidth = '15mm';
					
                    document.body.style.width = '210mm';
                    document.body.style.height = '297mm';
                    const img = new Image();
                    img.onload = () => {
						
                        if ((img.width / img.height) < (210 / 297)) {
	   
                            this.fieldHeight = '0mm';
                            this.imgHeight = '187mm';
                            this.imgWidth = 'auto';
	   
	  
                        } else {
	   
                            this.imgWidth = '200mm';
                            this.imgHeight = 'auto';
                            let imgPhysicalHeight = (200 / img.width) * img.height;
                            let imgHeightOfMargin = 10;
                            let sumOfFieldsMargin = 20 * 5;
                            let sumOfFieldsHeights = 297 - (imgPhysicalHeight + imgHeightOfMargin + sumOfFieldsMargin);
                            this.fieldHeight = (sumOfFieldsHeights / 5) + 'mm';
                            this.debug = `imgPhysicalHeight: ${imgPhysicalHeight}mm, sumOfFieldsHeights: ${sumOfFieldsHeights}mm`;
                        }
						
                    };
					
                    img.src = e.target.result;
                };
				
                reader.readAsDataURL(file);
            }
        },
		
        updated() {
			
            const d = new Date();
            d.setFullYear(this.year);
            d.setMonth(this.numberOfTheMonth);
            d.setMonth(d.getMonth() + 1);
            d.setDate(0);
            const numberOfDaysInMonth = d.getDate();
            d.setDate(1);
            let blankFieldsOfPreviousMonth = d.getDay() - 1;
            if (blankFieldsOfPreviousMonth == -1) blankFieldsOfPreviousMonth = 6;
            let oversize = blankFieldsOfPreviousMonth + numberOfDaysInMonth - 35;
            if (blankFieldsOfPreviousMonth == 6) blankFieldsOfPreviousMonth = 5;
			
            if (oversize > 0) {
                blankFieldsOfPreviousMonth = 0;
                while (d.getDay() != 1) d.setDate(d.getDate() + 1);
            }
			
            let days = [];
            let positionInTable = 0;
            let fieldColour = '#fff';

            const pushDay = (text) => {
                let width = '28mm';
                if (positionInTable % 6 == 5) width = '32mm';
                days.push({
                    number: text,
                    colour: fieldColour,
                    width: width
                });
                positionInTable++;
            };

            for (let i = 0; i < blankFieldsOfPreviousMonth; i++) pushDay('');
            fieldColour = '#FED800';

            let nextDayDate = new Date(d);
            nextDayDate.setDate(d.getDate() + 1);

            while (nextDayDate.getDate() >= d.getDate()) {
                if (d.getDay() != 0) pushDay(d.getDate());
                d.setDate(d.getDate() + 1);
                nextDayDate.setDate(nextDayDate.getDate() + 1);
            }

            if (d.getDay() != 0) pushDay(d.getDate());
            fieldColour = '#fff';

            for (let i = 0; i < 12; i++) pushDay('');

            this.days = days;
            this.$nextTick(this.updateFieldHeight); // Ensure fields are updated
        }
    },
    watch: {
        numberOfTheMonth: 'updated',
        year: 'updated'
    },
    mounted() {
        this.updated();
    }
});

app.mount('#app');
