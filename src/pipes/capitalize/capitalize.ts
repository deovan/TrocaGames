import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizePipe',
})
export class CapitalizePipe implements PipeTransform {

  transform(value: String, onlyFirst: boolean) {

    if (onlyFirst) return value.charAt(0).toUpperCase() + value.substr(1);

    let words: string[] = value.split(' ');
    let output: string = '';

    words.forEach((value: string, index: number, words: string[]) => {
      output += value.charAt(0).toUpperCase() + value.substr(1).toLowerCase() + ' ';
    });

    return output;

  }

}
