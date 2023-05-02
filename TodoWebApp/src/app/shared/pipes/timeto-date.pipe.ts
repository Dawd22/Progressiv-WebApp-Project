import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';


@Pipe({
  name: 'timetoDate',
  pure: false
})
export class TimetoDatePipe implements PipeTransform {

  transform(value: Timestamp): string {
    const dateValue = value instanceof Date ? Timestamp.fromDate(value) : value;
    const dateString = dateValue.toDate().toString();
    const trimmedDate = dateString.replace(/00:00:00 GMT.+$/, '');
    return trimmedDate;
  
  }


}
