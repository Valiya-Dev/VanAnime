import { MagnetFileDetails } from '../../../../libs/modal/magnet/file';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MagnetSubmitDto {
  @ApiProperty({
    type: Object,
    example: {
      details: {
        filesList: [
          {
            name: '[Nekomoe kissaten&VCB-Studio] Mobile Suit Gundam THE WITCH FROM MERCURY [01][Ma10p_1080p][x265_flac_aac].JPSC.ass',
            length: 63691,
          },
        ],
        torrentName:
          '[Nekomoe kissaten&VCB-Studio] Mobile Suit Gundam THE WITCH FROM MERCURY [Ma10p_1080p]',
        infoHash: '2cc849eb3552b6956668c6e90d7aa7c46018f4fc',
      },
      originMagnet: 'magnet:?xt=urn:btih:FTEET2ZVKK3JKZTIY3UQ26VHYRQBR5H4',
      source: 'dmhy',
    },
  })
  @IsNotEmpty()
  details: MagnetFileDetails;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originMagnet: string;

  @ApiProperty()
  @IsNotEmpty()
  source: string;
}
