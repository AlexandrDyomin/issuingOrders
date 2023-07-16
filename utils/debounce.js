function debounce(fn, delay, immediately = false) {
	let immediateCallTimer = null;
	let delayedCallTimer = null;

	return function debounced(...args) {
		if (immediately && !immediateCallTimer) return callFnNow(args);
		
		immediately && clearTimeout(immediateCallTimer);
		delayedCallTimer && clearTimeout(delayedCallTimer);
		callFnLater(args);
	}	

	function callFnNow(args) {
		immediateCallTimer = setTimeout(clearImmediateCallTimer, delay);
		fn.apply(this, args);
	}

	function callFnLater(args) {
		delayedCallTimer = setTimeout(function callFn() {
			fn.apply(this, args);
			immediately && (immediateCallTimer = setTimeout(clearImmediateCallTimer, delay));
			delayedCallTimer = null;
		}, delay);
	}

	function clearImmediateCallTimer() {
		immediateCallTimer = null;
	}	
}

export default debounce;