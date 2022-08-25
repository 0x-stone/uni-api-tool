import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  catchError,
  filter,
  interval,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { EnvService } from '../../common/services/env/env.service';
import { LoggerService } from '../../common/services/logger/logger.service';
import { SyncCoinInfoService } from '../../search/sync-coin-info/sync-coin-info.service';

interface IreqAlarmBody {
  level: number;
  ruleId: string;
  content: string;
  key?: string;
  handler?: string;
  backupHandler?: string;
  receiver?: string;
}

@Injectable()
export class AlarmService {
  constructor(
    private httpService: HttpService,
    private envService: EnvService,
    private syncCoinInfoService: SyncCoinInfoService,
    private loggerService: LoggerService,
  ) {}

  async onModuleInit() {
    if (this.envService.isProd || this.envService.isTestnet) {
      this.checkPriceUpdate().subscribe();
    }
  }

  public sendAlarm(body: IreqAlarmBody): Observable<any> {
    return this.httpService
      .post(
        `${this.envService.endPoint.ALARM_LINK}/efficiency/alarm-service/api/alarm/receiver/send`,
        { ...body },
        { headers: this._headers },
      )
      .pipe(
        catchError((err) => {
          this.loggerService.error(
            `[${AlarmService.name}] sendAlarm ${err.stack}`,
          );
          return of(true);
        }),
      );
  }

  private get _headers() {
    return {
      appId: this.envService.endPoint.ALARM_APP_ID,
      secret: this.envService.endPoint.ALARM_SECRET,
    };
  }

  private checkPriceUpdate(): Observable<any> {
    const TIME_OUT = 5 * 60 * 1000; // check every 5 mins
    const MAX_TIME_GAP = 15 * 60 * 1000; // 15 mins
    const priceUpdateTime = this.syncCoinInfoService.priceUpdateTime;
    return interval(TIME_OUT).pipe(
      map(() => {
        return Object.keys(priceUpdateTime).reduce((collect, pre: string) => {
          if (priceUpdateTime[pre] - Date.now() > MAX_TIME_GAP) {
            return collect.concat({
              type: pre,
              updateTime: new Date(priceUpdateTime[pre]),
            });
          }
        }, []);
      }),
      filter((timeOutList) => {
        return timeOutList.length !== 0;
      }),
      switchMap((timeOutList) => {
        return this.sendAlarm({
          level: 1,
          ruleId: '4883',
          content: `[content-cron] env: ${
            this.envService.env
          } Sync price data timeoutlist ${JSON.stringify(timeOutList)}
            )}`,
        });
      }),
      catchError((err) => {
        this.loggerService.error(
          `[${AlarmService.name}] checkPriceUpdate ${err.stack}`,
        );
        return of(true);
      }),
    );
  }
}
