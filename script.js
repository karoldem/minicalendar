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
            fieldWidth: '28mm'
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imageSrc = e.target.result;
                    this.fieldWidth = '20mm';
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
            var numberOfDaysInMonth = d.getDate();

            d.setDate(1);
            var blankFieldsOfPreviousMonth = d.getDay() - 1;

            if (blankFieldsOfPreviousMonth == -1) {
                blankFieldsOfPreviousMonth = 6;
            }

            var oversize = blankFieldsOfPreviousMonth + numberOfDaysInMonth - 35;

            if (blankFieldsOfPreviousMonth == 6) blankFieldsOfPreviousMonth = 5;

            if (oversize > 0) {
                blankFieldsOfPreviousMonth = 0;

                while (d.getDay() != 1) d.setDate(d.getDate() + 1);
            }

            var days = [];
            var positionInTable = 0;
            var fieldColour = '#fff';

            function pushDay(text) {
                var width = '28mm';

                if (positionInTable % 6 == 5) width = '32mm';

                days.push({
                    'number': text,
                    'colour': fieldColour,
                    'width': width
                });

                positionInTable++;
            }

            for (var i = 0; i < blankFieldsOfPreviousMonth; i++) pushDay();

            fieldColour = '#abea';

            var nextDayDate = new Date(d);
            nextDayDate.setDate(d.getDate() + 1);

            while (nextDayDate.getDate() >= d.getDate()) {
                if (d.getDay() != 0)
                    pushDay(d.getDate());
                d.setDate(d.getDate() + 1);
                nextDayDate.setDate(nextDayDate.getDate() + 1);
            }

            if (d.getDay() != 0)
                pushDay(d.getDate());

            fieldColour = '#fff';

            // Push additional blank fields to ensure 6 extra fields with background color
            pushDay(''); pushDay(''); pushDay('');
            pushDay(''); pushDay(''); pushDay('');

            this.days = days;
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
