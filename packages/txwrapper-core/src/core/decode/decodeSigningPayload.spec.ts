import {
	ASTAR_TEST_BASE_TX_INFO,
	ASTAR_TEST_METHOD_ARGS,
	ASTAR_TEST_OPTIONS,
	KUSAMA_TEST_OPTIONS,
	TEST_BASE_TX_INFO,
	TEST_METHOD_ARGS, WESTEND_TEST_OPTIONS,
} from '@substrate/txwrapper-dev';

import {
	balancesTransfer,
	balancesTransferKeepAlive,
	itDecodesBalancesTransferKeepAlive,
} from '../../test-helpers';
import { itDecodesBalancesTransferAstar } from '../../test-helpers';
import { DecodedSigningPayload } from '../../types';
import { construct } from '..';
import { decodeSigningPayload } from './decodeSigningPayload';

export function itDecodesSigningPayloadBalancesTransfer(
	decoded: DecodedSigningPayload,
): void {
	(
		[
			'blockHash',
			'genesisHash',
			'metadataRpc',
			'nonce',
			'specVersion',
			'tip',
		] as const
	).forEach((key) => expect(decoded[key]).toBe(TEST_BASE_TX_INFO[key]));
}

export function itDecodesSigningPayloadBalancesTransferAstar(
	decoded: DecodedSigningPayload,
): void {
	(
		[
			'blockHash',
			'genesisHash',
			'metadataRpc',
			'nonce',
			'specVersion',
			'tip',
		] as const
	).forEach((key) => expect(decoded[key]).toBe(ASTAR_TEST_BASE_TX_INFO[key]));
}

describe('decodeSigningPayload', () => {
	it('should decode balances::transferKeepAlive', () => {
		const signingPayload = construct.signingPayload(
			balancesTransferKeepAlive(
				TEST_METHOD_ARGS.balances.transferKeepAlive,
				TEST_BASE_TX_INFO,
				KUSAMA_TEST_OPTIONS,
			),
			KUSAMA_TEST_OPTIONS,
		);

		const decoded = decodeSigningPayload(signingPayload, KUSAMA_TEST_OPTIONS);

		itDecodesSigningPayloadBalancesTransfer(decoded);

		itDecodesBalancesTransferKeepAlive(decoded);
	});

	it('should decode balances::transfer with an immortal era', () => {
		const signingPayload = construct.signingPayload(
			balancesTransferKeepAlive(
				TEST_METHOD_ARGS.balances.transferKeepAlive,
				TEST_BASE_TX_INFO,
				Object.assign({}, KUSAMA_TEST_OPTIONS, { isImmortalEra: true }),
			),
			KUSAMA_TEST_OPTIONS,
		);

		const decoded = decodeSigningPayload(signingPayload, KUSAMA_TEST_OPTIONS);

		expect(decoded.eraPeriod).toBe(0);
	});

	it('should decode balances::transfer for Astar', () => {
		const signingPayload = construct.signingPayload(
			balancesTransfer(
				ASTAR_TEST_METHOD_ARGS.balances.transfer,
				ASTAR_TEST_BASE_TX_INFO,
				ASTAR_TEST_OPTIONS,
			),
			ASTAR_TEST_OPTIONS,
		);

		const decoded = decodeSigningPayload(signingPayload, ASTAR_TEST_OPTIONS);

		itDecodesSigningPayloadBalancesTransferAstar(decoded);

		itDecodesBalancesTransferAstar(decoded);
	});

	it('should decode balances::transfer with an immortal era for Astar', () => {
		const signingPayload = construct.signingPayload(
			balancesTransfer(
				ASTAR_TEST_METHOD_ARGS.balances.transfer,
				ASTAR_TEST_BASE_TX_INFO,
				Object.assign({}, ASTAR_TEST_OPTIONS, { isImmortalEra: true }),
			),
			ASTAR_TEST_OPTIONS,
		);

		const decoded = decodeSigningPayload(signingPayload, ASTAR_TEST_OPTIONS);

		expect(decoded.eraPeriod).toBe(0);
	});
	it('decode assets:setTeam', () => {
		// https://docs.google.com/spreadsheets/d/1AEmPCwr8292otTzDo9AEQ64IvyDEpO0bhXq-DZC1H08/edit?gid=512370644#gid=512370644&range=49:49
		const decoded = decodeSigningPayload("0x13cbe0fbb583b66c8514298b23b686bfc4777249f075c24b22a9ee134e258ec4", WESTEND_TEST_OPTIONS);

		console.log("decoded: ")
		console.log(decoded)
	});

	it('decode assets:transferOwnership msig init', () => {
		// https://docs.google.com/spreadsheets/d/1AEmPCwr8292otTzDo9AEQ64IvyDEpO0bhXq-DZC1H08/edit?gid=512370644#gid=512370644&range=57:57
		const decoded = decodeSigningPayload("0x290102000c3f9ca05d273c4ed62e2f5d0aa9300c78513875d0e1dfc03186731664a1ed824a68a6405cc230086c596c9e7cc90e79d7fb52292d7365cf6f1810579f97c07cbddc4b8673c5dee9fc96e7d2f68ec61b5bdfd045f523e3bbedc60af538700e95c100320fa6e9010000bcdb9b1895c5a03245a2aef24807f691a838f22be22f92e2b3a284afc33ae5000700e876481702093d00000400000008750f001000000067f9723393ef76214df0118c34bbbd3dbebc8ed46a10973a8c969d48fe7598c967f9723393ef76214df0118c34bbbd3dbebc8ed46a10973a8c969d48fe7598c900", WESTEND_TEST_OPTIONS);

		console.log("decoded: ")
		console.log(decoded)
	});
});
