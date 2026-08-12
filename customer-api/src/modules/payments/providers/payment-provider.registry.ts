import { Injectable } from '@nestjs/common';
import { PAYMENT_PROVIDER } from '@/src/utils/environmentConstants';
import { ManualDisabledPaymentProvider } from './manual-disabled.provider';
import { PaymentProvider } from './payment-provider';

@Injectable()
export class PaymentProviderRegistry {
  private readonly providers: ReadonlyMap<string, PaymentProvider>;

  constructor(manualDisabled: ManualDisabledPaymentProvider) {
    this.providers = new Map([[manualDisabled.name, manualDisabled]]);
    this.getConfiguredProvider();
  }

  get(name: string): PaymentProvider {
    const provider = this.providers.get(name.trim().toLowerCase());
    if (!provider) {
      throw new Error(
        `Unsupported PAYMENT_PROVIDER "${name}". Supported providers: ${[
          ...this.providers.keys(),
        ].join(', ')}`,
      );
    }
    return provider;
  }

  getConfiguredProvider(): PaymentProvider {
    return this.get(PAYMENT_PROVIDER);
  }
}
